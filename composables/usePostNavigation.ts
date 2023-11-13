interface Navigation {
  title: string,
  _path: string,
  children?: Navigation[]
}

interface Post {
  title: string
  path: string
}

export default function () {
  return useState('post-navigation', () => {
    const { navigation } = useContent()

    const posts = computed<Post[]>(() => parsePostFromNavigationTree(navigation.value[0]))

    return posts
  })
}

function parsePostFromNavigationTree (navigationTree: Navigation): Post[] {
  const posts: Post[] = []

  function dfs ({ title, _path, children }: Navigation) {
    if (children !== undefined) {
      children.forEach(navigation => dfs(navigation))
    } else {
      posts.push({ title, path: _path })
    }
  }

  dfs(navigationTree)

  return posts
}
