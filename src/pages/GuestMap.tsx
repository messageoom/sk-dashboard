import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Modal } from 'antd';
import { CloseOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { imageList, ImageItem } from '../data/imageList';
import './GuestMap.css';

const placeholderImage = '/images/placeholder.jpg';

const GuestMap: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 修改状态变量名
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [imageSources, setImageSources] = useState<Map<string, { url: string; status: 'loading' | 'success' | 'error' }>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target as HTMLImageElement;
            const imageName = imgElement.dataset.name!;
            const encodedImageName = encodeURIComponent(imageName);
            const imageUrl = `/images/${encodedImageName}`;

            if (!imageSources.has(imageName)) {
              setImageSources((prev) => {
                const newMap = new Map(prev);
                newMap.set(imageName, { url: placeholderImage, status: 'loading' });
                return newMap;
              });

              const img = new Image();
              img.src = imageUrl;
              img.onload = () => {
                setImageSources((prev) => {
                  const newMap = new Map(prev);
                  newMap.set(imageName, { url: imageUrl, status: 'success' });
                  return newMap;
                });
              };
              img.onerror = () => {
                setImageSources((prev) => {
                  const newMap = new Map(prev);
                  newMap.set(imageName, { url: placeholderImage, status: 'error' });
                  return newMap;
                });
              };
            }

            observerRef.current?.unobserve(imgElement);
          }
        });
      },
      { rootMargin: '100px' }
    );

    return () => observerRef.current?.disconnect();
  }, [imageSources]);

  const bindObserver = (element: HTMLImageElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setIsModalOpen(true); // 修改状态变量名
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 修改状态变量名
    setSelectedImage(null);
  };

  const getColumnCount = () => {
    const width = document.documentElement.clientWidth;
    const baseImageWidth = 103;
    const gutter = 4;
    const columnCount = Math.floor((width - 10) / (baseImageWidth + gutter));
    return Math.max(columnCount, 1);
  };

  const columnCount = getColumnCount();
  const rowCount = Math.ceil(imageList.length / columnCount);
  const columnWidth = (document.documentElement.clientWidth - 10) / columnCount;
  const rowHeight = columnWidth * 1.25;

  const customCloseIcon = (
    <div className="custom-close-button">
      <CloseOutlined />
    </div>
  );

  return (
    <div className="guest-map-container">
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={window.innerHeight}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={document.documentElement.clientWidth - 10}
        style={{ overflowX: 'hidden', overflowY: 'auto' }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => {
          const index = rowIndex * columnCount + columnIndex;
          if (index >= imageList.length) return null;
          const image = imageList[index];
          const imageData = imageSources.get(image.name) || { url: placeholderImage, status: 'loading' };
          const encodedImageName = encodeURIComponent(image.name);

          return (
            <div style={style}>
              <div className="image-item" onClick={() => handleImageClick(image)}>
                <div className="image-wrapper">
                  <img
                    ref={bindObserver}
                    data-name={image.name}
                    data-src={`/images/${encodedImageName}`}
                    src={imageData.url}
                    alt={image.name.replace('.jpg', '')}
                    className="guest-image"
                  />
                  {imageData.status === 'loading' && (
                    <div className="image-loading">
                      <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                  )}
                  {imageData.status === 'error' && (
                    <div className="image-error">
                      <ExclamationCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                    </div>
                  )}
                </div>
                <div className="image-name">{image.name.replace('.jpg', '')}</div>
              </div>
            </div>
          );
        }}
      </FixedSizeGrid>

      <Modal
        open={isModalOpen} // 使用 open 替换 visible
        onCancel={handleModalClose}
        footer={null}
        centered
        width={600}
        className="image-modal"
        wrapClassName="image-modal-wrapper"
        closeIcon={customCloseIcon}
      >
        {selectedImage && (
          <div className="modal-content">
            <div className="modal-image-wrapper">
              <img
                src={
                  imageSources.get(selectedImage.name)?.url || `/images/${encodeURIComponent(selectedImage.name)}`
                }
                alt={selectedImage.name.replace('.jpg', '')}
                className="modal-image"
              />
            </div>
            <div className="modal-title-wrapper">
              <h2 className="modal-title">{selectedImage.name.replace('.jpg', '')}</h2>
            </div>
            <div className="traits-container">
              <div className="trait-item">
                <span className="trait-label">食客</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">眼部</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">鼻部</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">手臂</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">手部</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">食物</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">配饰</span>
                <span className="trait-value">TODO!</span>
              </div>
              <div className="trait-item">
                <span className="trait-label">背景</span>
                <span className="trait-value">TODO!</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GuestMap;