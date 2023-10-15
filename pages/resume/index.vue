<script lang="ts" setup>
useHead({
  title: '个人简历',
  meta: [
    {
      name: 'keywords',
      content: '个人简历 Web前端 实习'
    },
    {
      name: 'author',
      content: 'qingshaner'
    },
    {
      name: 'description',
      content: 'Web前端实习简历'
    }
  ]
})

const tableData = {
  header: ['音乐', '电影', '运动'],
  data: [
    ['云烟成雨', '普罗米修斯', '骑行'],
    ['人间不值得', '你的名字', '爬山'],
    ['路过就好', '黑客帝国(动画)', '乒乓球']
  ]
}
</script>

<template>
  <main class="bg-slate-7 text-gray shadow-xl shadow-slate-7 pa-lg rounded-xl mx-auto max-w-4xl">
    <header class="select-none">
      <h1 class="text-center">
        个人简历
      </h1>
    </header>

    <section>
      <header class="select-none">
        <h2 class="before:content-['#'] before:text-lime-2 mb-0">
          基本信息
        </h2>
      </header>

      <hr class="border-gray border-dashed border-2">

      <ul class="font-bold line-height-6">
        <li>姓名: 未知</li>
        <li>学号: 21081715</li>
        <li>专业: 软件工程</li>
        <li>学校: 杭州电子科技大学</li>
      </ul>
    </section>

    <section>
      <header>
        <h2 class="before:content-['#'] before:text-lime-2 mb-0 select-none">
          自我介绍
        </h2>
      </header>

      <hr class="border-gray border-dashed border-2">

      <p class="font-bold indent-lg line-height-6">
        没错你是个明白人，我明白你明白的意思，我也是明白人，明白人就应该明白我明白你明白的意思，只要大家都明白明白人应明白我明白你明白的意思，这样网络环境就是充满明白人明白其他明白人所明白的事。
      </p>
    </section>

    <section>
      <header class="select-none">
        <h2 class="before:content-['#'] before:text-lime-2 mb-0">
          代码片段
        </h2>
      </header>

      <hr class="border-gray border-dashed border-2">

      <pre class="bg-slate-9 rounded-xl pa-xs line-height-6 overflow-x-auto"><code class="text-fuchsia">函数</code> <code class="text-rose">检查字数</code>(<code class="text-emerald">最少字数</code>: <code class="text-orange">整型</code>, <code class="text-emerald">待检查文章</code>: <code class="text-orange">字符串</code>): <code text-lightblue>是</code> | <code text-lightblue>否</code> {
    <code class="text-fuchsia">若</code> <code class="text-emerald">最少字数</code> &gt; <code class="text-emerald">待检查文章</code>.<code class="text-pink">长度</code> {
        <code class="text-fuchsia">返回</code> <code text-lightblue>否</code>
    }
    <code class="text-fuchsia">返回</code> <code text-lightblue>是</code>
}

<code class="text-fuchsia">常量</code> <code class="text-amber">最少字数</code>: <code class="text-orange">整型</code> <code class="text-blue-3">=</code> <code class="text-red">1000</code>
<code class="text-fuchsia">令</code> <code class="text-amber">文章</code>: <code class="text-orange">字符串</code> = <code class="text-lime-2">'每次我不知道该说什么的时候就不知道该说什么。'</code>

<code class="text-fuchsia">若</code> <code class="text-rose">检查字数</code>(<code class="text-amber">最少字数</code>, <code class="text-amber">文章</code>) {
    <code class="text-indigo">控制台</code>.<code class="text-pink">打印</code>(<code class="text-lime-2">'字数已达标'</code>)
} <code class="text-fuchsia">否则</code> {
    <code class="text-indigo">控制台</code>.<code class="text-pink">打印</code>(<code class="text-lime-2">'字数过少'</code>)
}
</pre>
    </section>

    <section>
      <header>
        <h2>个人爱好</h2>
      </header>

      <table class="w-full">
        <thead class="bg-slate-8">
          <tr>
            <th v-for="item of tableData.header" :key="item" class="border-solid border-1 border-slate-3 pa-2 text-center">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, index) of tableData.data" :key="index">
            <td v-for="item of list" :key="item" class="border-solid border-1 border-slate-3 pa-2 text-center">
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<style>
html {
  --uno: lg:px-lg py-lg bg-slate-8;
  color-scheme: dark;
}
</style>
