import React from 'react';
import styles from './QA.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGlobe, faHeart, faComment, faQrcode } from '@fortawesome/free-solid-svg-icons';

// 图标映射
const iconMap: { [key: string]: any } = {
  'fa-users': faUsers,
  'fa-globe': faGlobe,
  'fa-heart': faHeart,
  'fa-comment': faComment,
  'fa-qrcode': faQrcode,
};

interface QAItem {
  id: number;
  category: string;
  question: string;
  answer: string | React.ReactNode;
  icon: string;
  color: string;
}

const QA: React.FC = () => {
  const qaData: QAItem[] = [
    {
      id: 1,
      category: '关于我们',
      question: '我们是谁？',
      answer: '我们是疯狂食客PFP的藏家，也是疯狂食客的忠实粉丝，致力于推广和分享这一独特的数字藏品。',
      icon: 'fa-users',
      color: '#FF6F61',
    },
    {
      id: 2,
      category: '关于我们',
      question: '为什么开发这个网站？',
      answer: '由于疯狂食客官方网站意外下线，我们创建了这个网站，以便更好地向大众展示疯狂食客PFP藏品，让更多人了解和欣赏它们。',
      icon: 'fa-globe',
      color: '#4A90E2',
    },
    {
      id: 4,
      category: '网站相关',
      question: '网站运营经费从哪里来？',
      answer: (
        <div className={styles.answerText}>
          目前由疯狂食客俱乐部成员藏品持有者XXX慷慨赞助。如果您希望网站能够长期运营，欢迎贡献一份力量，
          <a
            href="https://afdian.com/a/eaterclub"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.supportLink}
          >
            为爱发电直达连接
          </a>
          ！
        </div>
      ),
      icon: 'fa-heart',
      color: '#FF69B4',
    },
    {
      id: 5,
      category: '网站相关',
      question: '如何反馈问题与建议？',
      answer: (
        <div className={styles.feedbackWrapper}>
          <div className={styles.answerText}>
            <p>
              我们没有专门的公众号，部分服务代理在
              <span className={styles.publicAccount}>云阅杂谈</span>
              公众号上。
            </p>
            <p>
              可扫码关注此公众号，通过公众号直接发送您的问题或建议，我们期待您的反馈！
            </p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.qrCodeWrapper}>
            <FontAwesomeIcon icon={iconMap['fa-qrcode']} className={styles.qrCodeIcon} />
            <img
              src="/qrcode_for_gh.jpg"
              alt="云阅杂谈公众号二维码"
              className={styles.qrCode}
            />
            <span className={styles.qrCodeText}>扫码关注云阅杂谈</span>
          </div>
        </div>
      ),
      icon: 'fa-comment',
      color: '#FFD700',
    },
  ];

  // 按 category 分组
  const groupedData = qaData.reduce((acc: { [key: string]: QAItem[] }, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className={styles.qaContainer}>
      <div className={styles.qaHeader}>
        <h1 className={styles.pageTitle}>Q&A</h1>
        <p className={styles.pageDescription}>常见问题解答，了解更多信息</p>
      </div>
      <div className={styles.qaList}>
        {Object.keys(groupedData).map((category, index) => (
          <div key={index} className={styles.qaCategory}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            {groupedData[category].map((item) => (
              <div className={styles.qaCard} key={item.id}>
                <h3 className={styles.qaQuestion} style={{ color: item.color }}>
                  <FontAwesomeIcon icon={iconMap[item.icon]} className={styles.qaIcon} />
                  {item.question}
                </h3>
                <div className={styles.qaAnswer}>
                  {typeof item.answer === 'string' ? (
                    <div className={styles.answerText}>{item.answer}</div>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;