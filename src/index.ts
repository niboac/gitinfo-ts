import { exec, execSync } from "child_process"

export async function getUsername(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git config --get user.name", (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`)
        return
      }
      if (stderr) {
        reject(`Git error: ${stderr}`)
        return
      }
      const gitUserName = stdout.trim()
      resolve(gitUserName)
    })
  })
}

export async function getHeadSha(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git rev-parse HEAD", (error, stdout, stderr) => {
      if (error) {
        reject(`Git error: ${error.message}`)
        return
      }
      if (stderr) {
        reject(`Git error: ${stderr}`)
        return
      }

      const currentBranch = stdout.trim()
      resolve(currentBranch)
    })
  })
}

export async function getCurrentTag(): Promise<string> {
  const lastCommitHash = await getHeadSha()
  // 获取当前分支名
  const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim()
  // 获取最后一次提交所在分支的所有 tag
  const tagList = execSync(`git tag --merged ${lastCommitHash}`, { encoding: "utf-8" }).trim().split("\n")
  // 过滤出当前分支上的 tag
  const currentBranchTags = tagList.filter((tag) => {
    const isTagOnCurrentBranch = execSync(`git branch --contains refs/tags/${tag} | grep "${currentBranch}"`, {
      encoding: "utf-8",
    }).trim()
    return isTagOnCurrentBranch !== ""
  })
  if (currentBranchTags.length > 0) {
    const tag = currentBranchTags[currentBranchTags.length - 1]
    return tag
  }
  return ""
}

export async function getBranchName(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --abbrev-ref HEAD", (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`)
        return
      }
      if (stderr) {
        reject(`Git error: ${stderr}`)
        return
      }

      const currentBranch = stdout.trim()
      resolve(currentBranch)
    })
  })
}

export async function hasUncommittedChanges(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exec("git status --porcelain", (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`)
        return
      }
      if (stderr) {
        reject(`Git error: ${stderr}`)
        return
      }

      resolve(stdout.trim() !== "")
    })
  })
}
