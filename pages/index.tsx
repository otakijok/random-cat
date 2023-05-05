import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import styles from './index.module.css';

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // 初期値を渡す
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);

  // // マウント時に画像を読み込む宣言
  // useEffect(() => {
  //  fetchImage().then(newImage => {
  //    // 画像URLの状態を更新
  //    setImageUrl(newImage.url);
  //    // ローディング状態を更新
  //    setLoading(false);
  //  });
  //}, []);

  // ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    // 読み込み中フラグを立てる
    setLoading(true);

    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} />}</div>
    </div>
  );
};

export default IndexPage;

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url
    }
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<any> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  if (!Array.isArray(images)) {
    throw new Error('画像が取得できませんでした。');
  }
  console.log(images);
  return images[0];
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
  // 値がオブジェクトか
  if (!value || typeof value !== 'object') {
    return false;
  }
  // urlプロパティが存在、かつ文字列
  return 'url' in value && typeof value.url === 'string';
};
