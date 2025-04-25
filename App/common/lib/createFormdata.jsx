/**
* Function used to create formdata from key-value object.
* @param {Object} formobj An object from which formdata will be created
* @param {number} [ver] Version
* @returns {FormData}
*/
export default function createFormdata(formobj, ver = 1) {
    return ver === 1 ? createFormdataV1(formobj) : createFormdataV2(formobj);
}
 
function createFormdataV1(formobj) {
    function insertItem(form, key, item) {
    if (
      item === null ||
      item === undefined ||
      typeof item === "function" ||
      item instanceof File
    )
      return;
    let primitives = ["number", "string", "boolean", "bigint"];
    if (primitives.indexOf(typeof item) > -1) {
      form.append(key, item);
      return;
    }
    for (const [inkey, initem] of Object.entries(item)) {
      insertItem(form, `${key}[${inkey}]`, initem);
    }
  }
 
    let formdata = new FormData();
    for (const [key, item] of Object.entries(formobj)) {
        insertItem(formdata, key, item);
    }
    return formdata;
}
 
function createFormdataV2(formobj) {
    function insertItem(form, key, item) {
        if (item === null || item === undefined || typeof item === "function")
            return;
        let primitives = ["number", "string", "boolean", "bigint"];
        if (primitives.indexOf(typeof item) > -1) {
            form.append(key, item);
        } else if (item instanceof FileList) {
            for (const file of item) insertItem(form, `${key}`, file);
        } else if (item instanceof File) {
            form.append(key, item, item.name);
        } else if (item instanceof Array) {
            for (let i = 0; i < item.length; i++)
                insertItem(form, `${key}[${i}]`, item[i]);
        } else {
            for (const [inkey, initem] of Object.entries(item)) {
                insertItem(form, `${key}.${inkey}`, initem);
            }
        }
    }
 
    let formdata = new FormData();
    for (const [key, item] of Object.entries(formobj)) {
        insertItem(formdata, key, item);
    }
    return formdata;
}
 