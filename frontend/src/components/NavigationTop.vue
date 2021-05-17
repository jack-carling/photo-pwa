<template>
  <div class="cyan darken-1">
    <i class="material-icons" @click="goBack()">reply</i>
  </div>
</template>

<script>
export default {};

function goBack() {
  window.history.back();
}
</script>

<style scoped>
div {
  height: 50px;
  border-bottom: 1px solid #cccccc;
}

i {
  color: white;
  font-size: 3rem;
  cursor: pointer;
}
</style>