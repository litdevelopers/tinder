import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';


import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

class DetailView extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.data || !this.props.currentImage) return true;
    if (this.props.currentImage !== nextProps.currentImage || this.props.data._id !== nextProps.data._id) return true;
    return false;
  }


  render() {
    if (!this.props.data || !this.props.imageData) return null;
    return (
      <div className={styles.detailViewContainer} >
        <div className={styles.detailViewContainer_mainPicture}>
          <ImageGallery
            defaultImage={this.props.data.photos[0].url}
            items={this.props.imageData}
            showBullets
            showThumbnails={false}
            showNav={false}
            renderItem={(item) => <div style={{ backgroundImage: `url(${item.original})`, height: 400, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />}
          />
        </div>

        <div className={styles.detailViewContainer_content}>
          <p>Hello</p>
        </div>
      </div>
    );
  }
}

DetailView.propTypes = {
  imageData: PropTypes.object.isRequiredOrNull,
  data: PropTypes.object.isRequired,
};


export default DetailView;
          // style={{
          //   backgroundImage: `url(${this.props.currentImage})`,
          // }}

// <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>


// <div className={styles.detailViewContainer_subPictures}>
        //   {this.props.imageData.map((each) => {
        //     return (
        //       <div
        //         key={each}
        //         className={styles.detailViewContainer_subPictures_picture}
        //         style={{ backgroundImage: `url(${each})` }}
        //       />
        //     );
        //   })}
        // </div>
