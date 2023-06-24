import { ErrorBase64 } from '@/contants';
import Slider from 'react-slick';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import { getSvgIcon } from '@/svgUtils';
import defaultColl from '@/assets/images/collections/defaultColl.png';
import { useThemes } from '@/components/hooks';

export default (props) => {
  const { data = [], type = 'collection' } = props;
  const {theme}  =useThemes();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: data?.length > 4 ? 4 : data?.length || 1,
    slidesToScroll: data?.length > 4 ? 4 : data?.length || 1,
    className: 'custom-slick-list',
    centerPadding: '125px',
    nextArrow: getSvgIcon(`slickArrow_${theme}`),
    prevArrow: getSvgIcon(`slickArrow_${theme}`),
  };

  return (
    <Slider {...settings}>
      {data?.map((va, index) => {
        switch (type) {
          case 'recommend':
            return (
              <a
                href={va.link}
                target="_blank"
                rel="noopener noreferrer"
                className="collect-item collect-content"
                key={va.id + index}
              >
                <Image src={va.uri || defaultColl} fallback={ErrorBase64} preview={false} />
                <span className="name-icon font-16 SemiMedium">
                  <span className="item-title limit-lines limit-lines-1">{va.name}</span>
                </span>
              </a>
            );
          case 'collection':
            return (
              <Link
                to={
                  va.link
                    ? va.link
                    : `/collections/tokens/${encodeURIComponent(va.creator + '::' + va.name)}`
                }
                className="collect-item collect-content"
                key={va.id + index}
              >
                <Image src={va.uri || defaultColl} fallback={ErrorBase64} preview={false} />
                <span className="name-icon font-16 SemiMedium">
                  <span className="item-title limit-lines limit-lines-1">{va.name}</span>
                </span>
              </Link>
            );
        }
      })}
    </Slider>
  );
};
