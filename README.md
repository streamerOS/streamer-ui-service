# streamer-ui-service

Web Service and Web UI that provide the user interface for streamerOS.

## Configuration

The configuration file is loaded from `/etc/streamerOS/ui-service.config` by default.

The following configuration settings are available:

| Name     | Default | Description                                               |
| -------- | ------- | --------------------------------------------------------- |
| `PORT`   | `9443`  | The port on which the services is listening for requests. |
| CERT_DIR |         | Directory where the SSL certificate is stored.            |

## How to create a SSL certificate

Generate a key file used for self-signed certificate generation. The command will create a private key as a file called `key.pem`.

```bash
openssl genrsa -out key.pem
```

Generate a certificate service request (CSR). A CSR provides all of the input necessary to create the actual certificate.

```bash
openssl req -new -key key.pem -out csr.pem
```

Generate the certificate by providing the private key created to sign it with the public key created in the previous step with an expiry date of 9,999 days. This command below will create a certificate called `cert.pem`.

```bash
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```
