<script setup>
import { ref } from 'vue'

defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

const previewImage = ref('')
const failedImages = ref([])

// 兼容Vite项目的部署路径
const getImageUrl = (path) => {
  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path
  }

  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}

// 打开图片预览
const openPreview = (path) => {
  previewImage.value = getImageUrl(path)
}

// 关闭图片预览
const closePreview = () => {
  previewImage.value = ''
}

// 图片加载失败
const handleError = (path) => {
  if (!failedImages.value.includes(path)) {
    failedImages.value.push(path)
  }
}
</script>

<template>
  <div v-if="images.length" class="question-images">
    <div v-for="(img, index) in images" :key="index" class="question-image-item">
      <div v-if="failedImages.includes(img)" class="image-error">题目图片暂时无法加载</div>

      <template v-else>
        <img
          :src="getImageUrl(img)"
          :alt="`题目附图 ${index + 1}`"
          class="question-image"
          loading="lazy"
          @click="openPreview(img)"
        />

        <span class="image-tip">点击图片查看大图</span>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="previewImage" class="image-preview-mask" @click.self="closePreview">
        <button type="button" class="preview-close" aria-label="关闭图片预览" @click="closePreview">
          ×
        </button>

        <img :src="previewImage" alt="题目附图预览" class="preview-image" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.question-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
}

.question-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.question-image {
  display: block;
  max-width: 100%;
  max-height: 360px;
  object-fit: contain;
  cursor: zoom-in;
  border-radius: 6px;
}

.image-tip {
  font-size: 12px;
  color: #94a3b8;
}

.image-error {
  padding: 20px;
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
}

.image-preview-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.85);
}

.preview-image {
  max-width: 95vw;
  max-height: 88vh;
  object-fit: contain;
  background: #ffffff;
  border-radius: 8px;
}

.preview-close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .question-image-item {
    padding: 10px;
  }

  .question-image {
    max-height: 280px;
  }

  .image-preview-mask {
    padding: 12px;
  }
}
</style>
