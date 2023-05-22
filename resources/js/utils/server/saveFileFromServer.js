import { saveAs } from 'file-saver';
export const saveFileFromServer = async (path, fileName) => {
    try {
        const response = await fetch(path);
        if (response.status === 200) {
            const blob = await response.blob();
            saveAs(blob, fileName);
        }
        // @ts-expect-error TS(2339): Property 'message' does not exist on type 'Respons... Remove this comment to see the full error message
        else
            throw new Error(response.message);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
};
