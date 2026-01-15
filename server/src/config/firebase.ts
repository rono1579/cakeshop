import  admin from 'firebase-admin';
import * as serviceAccount from './sweet-cakes-13b-firebase-adminsdk-fbsvc-b4491d5edb.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
