import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';
import { mimeTypeToFileExt } from 'src/common/util/mimeType';

import { OssSignAuthroizationParams } from './oss.interface';

@Injectable()
export class OssService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 签名计算
   * https://help.aliyun.com/document_detail/31951.html#section-rvv-dx2-xdb
   */
  signAuthorization(params: OssSignAuthroizationParams = {}) {
    const {
      method = 'PUT',
      date = new Date().toUTCString(),
      contentMd5 = '',
      contentType = '',
      headers = {},
      resourcePath = '',
      bucket = this.configService.get('OSS_BUCKET'),
    } = params;

    // build Canonical string
    const headersToSign = {
      'x-oss-date': date,
    };
    Object.keys(headers).forEach((key) => {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith('x-oss-')) {
        headersToSign[lowerCaseKey] = String(headers[key]).trim();
      }
    });
    const ossHeaders = Object.keys(headersToSign)
      .sort()
      .map((key) => {
        return key + ':' + headersToSign[key];
      });
    const canonicalizedResource = `/${bucket}/${resourcePath}`;

    const signContent = [
      method.toUpperCase(),
      contentMd5,
      contentType,
      date,
      // CanonicalizedOSSHeaders - https://help.aliyun.com/document_detail/31978.html
      ...ossHeaders,
      canonicalizedResource,
    ];

    const stringToSign = signContent.join('\n');

    console.log(this.configService.get('ALIYUN_ACCESS_KEY_SECRET'));

    // sign authorization
    const accessKeyId = this.configService.get('ALIYUN_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get('ALIYUN_ACCESS_KEY_SECRET');

    const sha = crypto.createHmac('sha1', accessKeySecret);
    const signature = sha
      .update(Buffer.from(stringToSign, 'utf-8'))
      .digest('base64');

    return `OSS ${accessKeyId}:${signature}`;
  }

  createUpload(contentType: string) {
    const id = nanoid();
    const fileExt = mimeTypeToFileExt(contentType);
    const objectName = id + fileExt;

    const date = new Date().toUTCString();
    const headers = {
      'Cache-Control': 'private;max-age=2592000',
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'x-oss-date': date,
      'x-oss-meta-kind': 'style-transfer',
    };

    const signParams: OssSignAuthroizationParams = {
      method: 'PUT',
      contentMd5: '',
      contentType: contentType,
      headers,
      resourcePath: objectName,
      bucket: this.configService.get('OSS_BUCKET'),
    };

    const authorization = this.signAuthorization(signParams);

    return {
      id,
      objectName,
      headers: {
        Authorization: authorization,
        Date: date,
        ...headers,
      },
      bucket: signParams.bucket,
    };
  }
}
