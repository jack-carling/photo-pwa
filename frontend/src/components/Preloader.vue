<template>
  <div></div>
</template>

<style scoped>
div {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #00acc1;
  border-top: 2px solid #eceff1;
  animation: rotate 0.7s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
