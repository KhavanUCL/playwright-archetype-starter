import * as fs from 'fs';
import * as path from 'path';

// interface TestData {
//     [key: string]: {
//         [key: string]: string;
//     };
// }

interface TestData {
    [key: string]: any;
}
export const getTestDataStringFromJsonFile = (fileName: string, dataSet: string, key: string) => {
    //function getTestDataStringFromJsonFile(fileName: string, dataSet: string, key: string): string | undefined {
    const file_path = getJsonFilePathFromFileName(fileName);
    if (!file_path) {
        throw new Error(`File path not found for file name: ${fileName}`);
    }
    try {
        const data: TestData = JSON.parse(fs.readFileSync(file_path, 'utf8'));

        if (dataSet in data) {
            const given_data_set = data[dataSet];
            const search_data = given_data_set[key];
            console.log("searchData: " + search_data);
            return search_data;
        } else {
            console.log(`Dataset ${dataSet} not found in the JSON.`);
            return undefined;
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return undefined;
    }
}

export const getTestDataFromJsonFile = (fileName: string, dataSet: string) => {
    //function getTestDataFromJsonFile(fileName: string, dataSet: string): string | undefined {
    const file_path = getJsonFilePathFromFileName(fileName);
    if (!file_path) {
        throw new Error(`File path not found for file name: ${fileName}`);
    }
    try {
        const data: TestData = JSON.parse(fs.readFileSync(file_path, 'utf8'));

        if (dataSet in data) {
            const given_data_set = data[dataSet];
            console.log("searchDataSet: " + given_data_set);
            return given_data_set;
        } else {
            console.log(`Dataset ${dataSet} not found in the JSON.`);
            return undefined;
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return undefined;
    }
}
export const getJsonFilePathFromFileName = (fileName: string) => {
    //function getJsonFilePathFromFileName(fileName: string): string | undefined {
    const current_dir = path.resolve(process.cwd(), 'testdata', process.env.ENV_NAME);

    let file_path: string | undefined;

    fs.readdirSync(current_dir, { withFileTypes: true }).forEach(entry => {
        if (entry.isFile() && entry.name.includes(fileName)) {
            file_path = path.resolve(current_dir, entry.name);
        }
    });
    console.log("filePath: " + file_path);
    return file_path;
}

export const addObjectToJsonFile = (fileName: string, dataSet: string, newObject: any) => {
    const file_path = getJsonFilePathFromFileName(fileName);
    if (!file_path) {
        throw new Error(`File path not found for file name: ${fileName}`);
    }
    try {
        let data: TestData = {};
        if (fs.existsSync(file_path)) {
            const fileContent = fs.readFileSync(file_path, 'utf8');
            data = JSON.parse(fileContent);
        }
        data[dataSet] = newObject;
        fs.writeFileSync(file_path, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Object added to dataset '${dataSet}' in file: ${fileName}`);
        return true;
    } catch (error) {
        console.error('Error adding object to JSON file:', error);
        return false;
    }
}