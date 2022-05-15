import { create } from 'dva-core';
import appModel from '/models/app';


let store = null;

function createStore() {
  if (store) {
    return store;
  }
    // model集合
  const models = [appModel];

  // 初始化dva
  const app = create({
    onHmr(...args) {
      console.log('dva onHrm trigger', args);
    },
    onError(e) {
      console.log('dva error', e);
    },
  });

  models.forEach(model => app.model(model));

  // 启动
  app.start();

  store = app._store;
  return store;
}

createStore();

export { store };
