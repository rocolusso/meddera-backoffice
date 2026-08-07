import React from 'react';

const Page = () => {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `  body {
    height: 200vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .wrapper {
    margin-top: 80vh;
  }

  .cta-btn {
    position: relative;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 14px;
    cursor: pointer;
    overflow: hidden;

    transform: translateY(40px);
    opacity: 0;
    animation: fadeSlideIn 1s ease forwards 0.3s;

    box-shadow: 0 10px 25px rgba(99,102,241,0.3);
    transition: all 0.3s ease;
  }

  /* ✨ AUTO SHINE */
  .cta-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -120%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.35) 50%,
      rgba(255,255,255,0) 100%
    );
    transform: skewX(-25deg);

    animation: shineLoop 2.5s infinite;
  }

  /* Hover усиливает эффект */
  .cta-btn:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 15px 35px rgba(139,92,246,0.5);
  }

  .cta-btn:active {
    transform: scale(0.98);
  }

  /* ENTRY */
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ✨ LOOP SHINE (мигает раз в несколько секунд) */
  @keyframes shineLoop {
    0% {
      left: -120%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    40% {
      left: 120%;
      opacity: 0;
    }
    100% {
      left: 120%;
      opacity: 0;
    }
  }`}}>

            </style>
            <div className="wrapper">
                <button className="cta-btn">
                    Записаться онлайн
                </button>
            </div>
        </>
    );
};

export default Page;
