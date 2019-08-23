import AsyncStorage from '@react-native-community/async-storage'

class JQStorage {
    /**
     * 获取
     * @param key
     * @return {Promise<T>|*|Promise.<TResult>}
     */
    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            return jsonValue;
        });
    }

    /**
     * 保存
     * @param key
     * @param value
     * @return {*}
     */
    static save(key, value){
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 更新
     * @param key
     * @param value
     * @return {Promise<T>|Promise.<TResult>}
     */
    static update(key, value) {
        return JQStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        })
    }

    /**
     * 删除
     * @param key
     * @return {*}
     */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }
}

export default JQStorage;
