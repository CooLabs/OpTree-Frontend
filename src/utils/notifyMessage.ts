import React from 'react';
import { message } from 'antd';
import { getSvgIcon } from '@/svgUtils';
const Success = getSvgIcon('success');
const Info = getSvgIcon('info');
const Error = getSvgIcon('error');

export function showSuccessMessage(
  content: React.ReactNode | string,
  duration?: number,
  key?: string | number,
  onClose?: () => void
) {
  message.success({ content, icon: Success, duration, key, onClose });
}

export function showInfoMessage(
  content: React.ReactNode | string,
  duration?: number,
  key?: string | number,
  onClose?: () => void
) {
  message.info({ content, icon: Info, duration, key, onClose });
}

export function showWarningMessage(
  content: React.ReactNode | string,
  duration?: number,
  key?: string | number,
  onClose?: () => void
) {
  message.warning({ content, icon: Info, duration, key, onClose });
}

export function showErrorMessage(
  content: React.ReactNode | string,
  duration?: number,
  key?: string | number,
  onClose?: () => void
) {
  message.error({ content, icon: Error, duration, key, onClose });
}

export function showLoadingMessage(
  content: React.ReactNode | string,
  duration?: number,
  key?: string | number,
  onClose?: () => void
) {
  message.loading({ content, duration, key, onClose });
}
