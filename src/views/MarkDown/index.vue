<template>
<Title></Title>
  <v-md-editor v-model="text" height="690px"></v-md-editor>
</template>

<script>
import Title from "@/views/MarkDown/Title.vue"
export default {
  components: { Title },
  data() {
    return {
      text: '',
    };
  },
};
</script>