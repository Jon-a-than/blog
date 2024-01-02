import { renderComments } from './comment'
import { renderToc } from './toc'
import { renderRecommendPost } from './recommend'
import { serviceWorkerPromise } from '@/shared/index'

renderToc()
renderRecommendPost()
serviceWorkerPromise.then(renderComments)
