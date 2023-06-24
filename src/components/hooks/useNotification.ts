import React from 'react';
import {  notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const useOpenNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, message, description) => {
    api[type]({
      message,
      description
    });
  };

  return {contextHolder, openNotificationWithIcon}
};

export default useOpenNotification;