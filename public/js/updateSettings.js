import axios from 'axios';
import { showAlert } from './alerts';

// type is either pw or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'patch',
      url,
      data,
    });
    console.log(type);
    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully`);
      window.setTimeout(function () {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
