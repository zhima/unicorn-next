import { create } from 'dva-core';
import storage from './storage'
import { persistReducer, persistStore } from 'redux-persist';
import appModel from '/models/app';

// model集合
const models = [appModel];

// 持久化配置
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['app'], // 持久化储存model白名单
};

const persistEnhancer = createStore => (reducer, initialState, enhancer) =>
  createStore(persistReducer(persistConfig, reducer), initialState, enhancer);

// 初始化dva
const app = create({
  extraEnhancers: [persistEnhancer],
  onHmr(...args) {
    console.log('dva onHrm trigger', args);
  },
  onError(e) {
    console.log('dva error', e);
  },
});

// 注册model
if (!global.registered) {
  models.forEach(model => app.model(model));
}
global.registered = true;

// 启动
app.start();

const store = app._store;
// 持久化store
const persistor = persistStore(store);

export { store, persistor };
