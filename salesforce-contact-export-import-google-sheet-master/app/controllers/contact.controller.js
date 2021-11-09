const { GoogleSpreadsheet } = require("google-spreadsheet");
var { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;
var jsforce = require("jsforce");

const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
});

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

exports.exportFile = function (req, res) {
  conn.query("SELECT Id, Name, Phone, Email FROM Contact", (err, result) => {
    if (err) {
      res.json({ err });
    } else {
      createSheet(result.records);
      res.json({
        status: "success",
        code: 200,
        url: "https://docs.google.com/spreadsheets/d/1Z5naDGt9Jv6vV-DLy2Vvb4BdQ4o54hDUvmZ-lg3mv7E/edit#gid=1597669205",
        message: "Contact Export Successfully",
      });
    }
  });
};

async function createSheet(value) {
  const headers = [];
  for (const header in value[0]) {
    if (header !== "attributes") headers.push(header);
  }
  const doc = new GoogleSpreadsheet(
    "1Z5naDGt9Jv6vV-DLy2Vvb4BdQ4o54hDUvmZ-lg3mv7E"
  );

  await doc.useServiceAccountAuth({
    client_email: "eb-741@coherent-vision-314713.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1aHlRAg/yxGxY\nbrgeY1WpbgH3UdZ8iXwuv1IwKHkWrp/uPc+vaEshsoP+BOmdHL6Xn79regPVZmlR\nxB8vg5ttkwjwR/zomtjMSr3qPvw3bMb7AK6eFIK8/3wgbKO+UZSpuEwBjuDaLiIh\nBCjrqUmAqz1xSAqf1UE1oMKCgAzfH2GD9UL/3qFGldkKncovinR/xIvNpk+Z7AS/\n8WrC17YSBnQm9WLAGDC/iOXIaUQln3MeNNmLE8/PVKZ9jCvqb2wX2fGo11PdZjmG\nhHpuOoBR5nUCYfRePsqSqvwOMeGXt5css4+fMh0jOBJ2xNxM9K8c28ttiEu4cyLQ\n3oVVeGw7AgMBAAECggEADi9LoSp0ncp/IFEUA4hH5/YqoDCdgWJsu+kI36wif8QK\nzGG37iLNESb4zDGNJNRdENUUbi59wz99R7/6okf7rM88+TDf1T5aamsDu5/OL/VI\n/9J3VPQMnwOpLI3iJd0SL00yYELQUS8fSw6ctoSnszBwnv1/myzdKvjVjMe/eejD\n6v4qx0SlH3SnxqQcW0g68oLqrh8i6fDAtKCP8KQili9RqMaDuTit5VtVCsHyQjva\n2VFFch3qqvFy/F9D4HPJ8drAywZEqcMt4p4TBEa6hwl/EMjgq0uaXtoyVseQGGeq\nLXoXnvzhRC6Y93xDa8ViG3aheWkvQ2PSae1MTOR/EQKBgQDsKDfZlPvakZY9VDHV\na/BaTsQquVJqSsSJnImmPqpEc8K50nf755s5G0ImIP7MND8znD9Li6QZkFNFnYlX\nlcmbLZC9zmQSwU3euaZlskqiSX1VgpoEIFyzWG3V7cEuesw5ozsAhJSxUO+GroVN\nMFvQfKUqydCGZd0WmdIIw2ZfywKBgQDEpphH5nTA220AIm60LRraSRZM5S2nD2B/\no+3SS0YV9TFgdE2eaPdN0G0YUlD3EndZQFxgSybWMzW8Z0351jm9v/aXwGuG2M/p\nNdPIiJhHc7CuFbO7x3k/5NxMq0XrI+zcJMVckcKZzYta2JjvZn3zCmIXqGfh3miy\niArAc463UQKBgQCBfDPTS4skdrsn+WgxmzN4cMPCoUZ9HW3R/lDDJIz7Z3WXqb08\nE+vaTgXhHipXETauN7fE1lYt5iKigxRxP6IBQeShDe91ESR/QM/p5u5hOWZNYoTM\nSmpJs+zVZb2MnKwp1kRdrlRRPQ14jWxtvFw7Xny5j1qUtnmZENJHF8ykLQKBgAoH\nLNDN0bpb9i0BlH+fpTTocTiunytbv2IC7AfDSumnvULb63FejO3s6QNKf1J6IJfu\njkdizbIynlTjN7i70en5Ngv7BgC0YbXUxt39CTbrkWDvPmEfBPHbK9jFCyW4iUWY\nom/cBv5s2uRhEztyEI4qQ2JNdi6wdspT4ah6vBZhAoGBAII4VRToO4VUdEEmNxxf\nsy2W9/BUpS8D0b/XOvDsBoIQLZAMga85itXad+w4e7vTbox4Q1h3Cs/+nVj18tqe\nuxnhRsN+7Xno5XkBeMtsmTXzMP0v4bPcd4Ry57AuDHn4F42ImqIynJqi73cIDwrm\nwUwDhHk0KI0yzDvuYuXRzkOi\n-----END PRIVATE KEY-----\n",
  });

  const sheet = await doc.addSheet({ headerValues: headers });
  await sheet.addRows(value);
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  await rows[1].save(); // save updates
}
