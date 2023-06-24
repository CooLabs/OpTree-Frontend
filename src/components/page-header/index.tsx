import { Image, Skeleton, Spin } from 'antd';
import DefaultCollectionAvatar from '@/assets/images/collections/title.webp';
import bg from '@/assets/images/collections/bg.jpg';
import { Avatar } from 'antd';
import './index.less';

export default (props: { url?: string; type?: string; bannerUrl?: string }) => {
  const { url,  bannerUrl } = props;
  const defaultAvatar = DefaultCollectionAvatar ;
  const defaultBanner = bg ;

  return (
    <div className="page-header">
        <div className="page-header-banner">
            <Image
              src={bannerUrl || defaultBanner}
              fallback={defaultBanner}
              preview={false}
              placeholder={<Skeleton.Image />}
            />
        </div>

          
     
    </div>
  );
};
