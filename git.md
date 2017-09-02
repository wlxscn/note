### git status

会列出已缓存，为缓存和未跟踪的文件

### git log 

 + --oneline 会将每个提交历史压缩到一行

 + --graph --decorate --oneline 以图形样式展示提交历史

### git checkout

+ git checkout <commit> //检出某个提交,不影响项目的当前状态
  回到项目当前状态 git checkout <branch> 
+ git checkout <commit> file //检出某个提交的文件,会影响项目的当前状态。检出到最近版本执行:
  git checkout HEAD file

### git revert <commit>(撤销)
生成一个撤销commit引入修改的新提交。git revert只是撤销了单独一个提交，并不会移除后面的提交

### git reset <commit>(重设)  

+ --soft 只移除index区的修改
+ --mixed 移除缓存区的修改
+ --hard 移除工作区的修改