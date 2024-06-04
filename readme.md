# gitinfo-ts

get git infomation, including username, branch, tag, commit...

### Install

```
npm i gitinfo-ts
```

### Usage

```javascript
import { getUsername } from 'gitinfo-ts'

async function getMyName() {
  const username = await getUsername();
}

```

### All Functions

```javascript

export declare function getUsername(): Promise<string>;
export declare function getHeadSha(): Promise<string>;
export declare function getCurrentTag(): Promise<string>;
export declare function getBranchName(): Promise<string>;
export declare function hasUncommittedChanges(): Promise<boolean>;


```
