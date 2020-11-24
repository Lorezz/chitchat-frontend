import jwtDecode from 'jwt-decode';
import moment from 'moment';

export const checkIfExpired = (token) => {
  const decoded = jwtDecode(token);
  const { exp } = decoded;
  const fmt = 'YYYY-MM-DD HH:mm:ss';
  const expire = moment(exp * 1000).format(fmt);
  // console.log('expire', expire);
  const now = moment().format(fmt);
  if (now > expire) {
    // console.log('EXPIRED');
    return true;
  }
  // console.log('NOT EXPIRED');
  return false;
};

const bgs = [
  'photo-1560159973-834f94608dac', // meduse neon
  'photo-1543785520-f52fecf4ecfa', // legno bianco e blu
  'photo-1492892132812-a00a8b245c45', // edera su legno
  'photo-1485841938031-1bf81239b815', // foglie viola e verdi
  'photo-1533899114961-3aa0579cd5b8', // muro rosso
  'photo-1498962342534-ee08a0bb1d45', // legno blu scuro
  'photo-1503756234508-e32369269deb' // spiaggia rossa

  // 'photo-1582390731001-df98bfbbd2c9', // jelly dark
  // 'photo-1525467187333-8e3f68b8e742', // jelly electric
  // 'photo-1559291001-693fb9166cba', // jelly colors
  // 'photo-1496715976403-7e36dc43f17b' // sparkles
  // 'photo-1504083898675-c896ecdae86e' // casa rosa
  // 'photo-1475965894430-b05c9d13568a' // crepe terra bianca
  // 'photo-1524312966005-030e396636fd', // muro ocra
  // 'photo-1465146633011-14f8e0781093', // sabbia nera
  // 'photo-1502207252192-3e376a5b50bf', // edera su legno chiaro
  // 'photo-1509114397022-ed747cca3f65', // nuvole saturate
  // 'photo-1571991353510-c56991327c3b', //mushrooms
  // 'photo-1537829382363-dfe2e5e72d36', //vinil
  // 'photo-1547409594-d172436140a5', //snow mountain
  // 'photo-1492138623748-a1b1f758a762', // vetro police drops
  // 'photo-1473181488821-2d23949a045a' // tavolo con blocknote
  // "photo-1496504175726-c7b4523c7e81", //blu astratto
];

function getRandomInt(min, max) {
  const cmin = Math.ceil(min);
  const cmax = Math.floor(max);
  return Math.floor(Math.random() * (cmax - cmin)) + cmin; // Il max è escluso e il min è incluso
}
export const getBg = () => {
  const r = getRandomInt(0, bgs.length);
  const pic = bgs[r];
  const picUrl = `https://images.unsplash.com/${pic}?&auto=format&fit=crop&w=1200&q=80`;
  console.log(`
   Images are all from Unsplash.com.
   This bg credits: ${picUrl}
   `);
  return picUrl;
};

export const humanFileSize = (bytes, si = true) => {
  var thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};

export const loadImgFromUrl = (imageURL) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageURL;
  });
};

export const loadImgFromBlob = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataUrl = e.target.result;
        loadImgFromUrl(e.target.result)
          .then((image) => resolve({ image, dataUrl }))
          .catch((ee) => reject(ee));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsDataURL(blob);
  });
};
