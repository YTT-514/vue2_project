import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 技能 + 兴趣 store
// state → skills/interests；getters → 计数与筛选；actions → 增删
export const useSkillsStore = defineStore('skills', () => {
  // ---------- state ----------
  const skills = ref([
    { id: 1, name: 'HTML5' },
    { id: 2, name: 'CSS3' },
    { id: 3, name: 'JavaScript' },
    { id: 4, name: 'Vue 3' },
    { id: 5, name: 'React' },
    { id: 6, name: 'Node.js' },
    { id: 7, name: 'Python' },
    { id: 8, name: 'Git' }
  ])

  const interests = ref([
    {
      id: 1,
      name: '摄影',
      images: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Golden%20sunrise%20over%20misty%20mountains%2C%20professional%20photography%2C%20landscape%2C%20warm%20light&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=City%20night%20skyline%20with%20light%20trails%2C%20long%20exposure%20photography%2C%20blue%20and%20purple%20tones&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Close-up%20of%20a%20dewdrop%20on%20a%20flower%20petal%2C%20macro%20photography%2C%20soft%20bokeh%20background&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Aerial%20view%20of%20winding%20coastline%20at%20sunset%2C%20drone%20photography%2C%20vivid%20orange%20sky&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Silhouette%20of%20a%20photographer%20with%20camera%20on%20tripod%20against%20starry%20night%20sky%2C%20milky%20way&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Black%20and%20white%20street%20photography%2C%20rainy%20city%20intersection%2C%20reflection%20on%20wet%20pavement&image_size=landscape_4_3'
      ]
    },
    {
      id: 2,
      name: '旅游',
      images: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tropical%20beach%20with%20turquoise%20water%2C%20palm%20trees%2C%20white%20sand%2C%20sunny%20travel%20destination&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ancient%20European%20cobblestone%20street%2C%20medieval%20architecture%2C%20warm%20afternoon%20light%2C%20travel%20photography&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Great%20Wall%20of%20China%20at%20golden%20sunset%2C%20mountains%2C%20panoramic%20travel%20view&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hot%20air%20balloons%20over%20Cappadocia%20Turkey%20at%20sunrise%2C%20travel%20adventure%20scene&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Northern%20lights%20aurora%20borealis%20over%20snowy%20mountains%20in%20Iceland%2C%20travel%20landscape&image_size=landscape_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cherry%20blossom%20in%20Kyoto%20Japan%2C%20traditional%20temple%2C%20pink%20petals%20falling%2C%20spring%20travel&image_size=landscape_4_3'
      ]
    },
    { id: 3, name: '追剧' }
  ])

  // ---------- getters ----------
  const skillCount = computed(() => skills.value.length)
  const interestCount = computed(() => interests.value.length)
  // 有图集的兴趣（用于展示图片入口）
  const interestsWithImages = computed(() => interests.value.filter(i => i.images?.length))

  // ---------- actions ----------
  // 生成下一个 id
  function nextSkillId(list) {
    return list.value.length ? Math.max(...list.value.map(s => s.id)) + 1 : 1
  }
  // 新增技能
  function addSkill(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    skills.value.push({ id: nextSkillId(skills), name: trimmed })
  }
  // 删除技能
  function removeSkill(id) {
    const idx = skills.value.findIndex(s => s.id === id)
    if (idx > -1) skills.value.splice(idx, 1)
  }
  // 新增兴趣
  function addInterest(name, images = []) {
    const trimmed = name.trim()
    if (!trimmed) return
    interests.value.push({ id: nextSkillId(interests), name: trimmed, images })
  }
  // 删除兴趣
  function removeInterest(id) {
    const idx = interests.value.findIndex(i => i.id === id)
    if (idx > -1) interests.value.splice(idx, 1)
  }

  return {
    skills, interests,
    skillCount, interestCount, interestsWithImages,
    addSkill, removeSkill, addInterest, removeInterest
  }
})
