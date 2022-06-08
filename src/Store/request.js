
import { GetBaseUrl } from '../Common/BaseUrl'

export default function request(input, data,token) {
  return fetch(GetBaseUrl()+input, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      'Token': token,
      // Token: Decrypt(getToken())
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
  })
    .then((res) => {
      const response = res.json();
      response.then((data) => {
        if (!data) {
          return;
        }

        if (data.StatusCode === 400) {
          console.log('请求错误 ' + data.Error);
          //Confirm.show(data?.Result?.Information || '');
        }
      });
      return response;
    })
    .catch((e) => {
      console.log(e);
      return e;
    });
}
