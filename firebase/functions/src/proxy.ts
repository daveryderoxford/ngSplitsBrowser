import { onRequest } from 'firebase-functions/v2/https';
import { log, error as log_error} from 'firebase-functions/logger';

export const resultsProxy = onRequest(
  { cors: true },
  async (req, res) => {
    const url = req.query.url;

    if (!url || typeof url !== 'string') {
      log("resultsProxy: URL not provided.  Status code 400");
      res.status(400).send('Please provide a URL in the query string.');
      return;
    }

    try {
      log("resultsProxy: fetching url" + url);

      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
        }
      });

      log(`resultsProxy: fetch complete. Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        res.status(response.status).send(response.statusText);
        return;
      }

      let contentType = response.headers.get('content-type') || 'text/html';
      // Add utf8 encoding to content type if it is not specified by the server
      if (contentType.includes('text/') && !contentType.includes('charset')) {
        contentType += '; charset=utf-8';
      }
      res.setHeader('Content-Type', contentType);
      const body = await response.text();

      res.status(response.status).send(body);
    } catch (error: any) {  
      if (error.statusCode) {
        log_error('Error fetching URL:', error.message);
        res.status(error.statusCode).send(error.message);
      } else {
        log_error('Error fetching URL:', error.toString());
        res.status(500).send('Error fetching the URL.');
      }
    }
  }
);
