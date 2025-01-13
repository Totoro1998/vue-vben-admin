<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@shaolin/common-ui';
import { LOGIN_PATH } from '@shaolin/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
