import * as crypto from 'crypto';
import { Service } from 'egg';
import { nanoid } from 'nanoid';
import { mimeTypeToFileExt } from '../util/mimeType';

interface OssSignAuthroizationParams {
  method?: string,
  date?: string,
  contentMd5?: string,
  contentType?: string,
  headers?: AnyObject,
  resourcePath?: string
  bucket?: string,
}

export default class OssService extends Service {

  bucketList = {
    dev: 'tale-style-transfer-dev',
    prod: 'tale-style-transfer',
  };

  /**
   * 签名计算
   * https://help.aliyun.com/document_detail/31951.html#section-rvv-dx2-xdb
   */
  signAuthorization(
    params: OssSignAuthroizationParams = {},
  ) {

    const {
      method = 'PUT',
      date = (new Date()).toUTCString(),
      contentMd5 = '',
      contentType = '',
      headers = {},
      resourcePath = '',
      bucket = this.bucketList.dev,
    } = params;


    // build Canonical string
    const headersToSign = {
      'x-oss-date': date,
    };
    Object.keys(headers).forEach(key => {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith('x-oss-')) {
        headersToSign[lowerCaseKey] = String(headers[key]).trim();
      }
    });
    const ossHeaders = Object.keys(headersToSign).sort().map(key => {
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

    // sign authorization
    const accessKeyId = this.config.ACCESS_KEY_ID;
    const accessKeySecret = this.config.ACCESS_KEY_SECRET;

    const sha = crypto.createHmac('sha1', accessKeySecret);
    const signature = sha.update(Buffer.from(stringToSign, 'utf-8')).digest('base64');

    return `OSS ${accessKeyId}:${signature}`;
  }

  createUpload(params: Pick<OssSignAuthroizationParams, 'contentMd5' | 'contentType' | 'bucket'> & {
    client?: 'string'
  } = {}) {
    const id = nanoid();
    const fileExt = mimeTypeToFileExt(params.contentType);
    const objectName = id + fileExt;

    const date = (new Date()).toUTCString();
    const headers = {
      'Cache-Control': 'private;max-age=2592000',
      'Content-Type': params.contentType,
      'Content-Disposition': 'inline',
      'x-oss-date': date,
      'x-oss-meta-client': params.client,
      'x-oss-meta-kind': 'style-transfer',
    };

    const signParams: OssSignAuthroizationParams = {
      method: 'PUT',
      contentMd5: params.contentMd5,
      contentType: params.contentType,
      headers,
      resourcePath: objectName,
      bucket: params.bucket,
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
      bucket: params.bucket,
    };
  }
}
