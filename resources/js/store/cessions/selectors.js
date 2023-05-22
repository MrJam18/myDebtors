import { SelectorCreator } from "../base/selectorCreator";
export const cessionsSelector = new SelectorCreator('cessions');
cessionsSelector.easyCreator('searchList');
cessionsSelector.easyCreator('loading');
cessionsSelector.easyCreator('list');
cessionsSelector.easyCreator('info');
// @ts-expect-error TS(2339): Property 'selectInfoError' does not exist on type ... Remove this comment to see the full error message
cessionsSelector.selectInfoError = cessionsSelector.chunkCreator('info.error');
// @ts-expect-error TS(2339): Property 'selectInfoLoading' does not exist on typ... Remove this comment to see the full error message
cessionsSelector.selectInfoLoading = cessionsSelector.chunkCreator('info.loading');
// @ts-expect-error TS(2339): Property 'selectInfoCount' does not exist on type ... Remove this comment to see the full error message
cessionsSelector.selectInfoCount = cessionsSelector.chunkCreator('info.count');
// @ts-expect-error TS(2339): Property 'selectInfoRows' does not exist on type '... Remove this comment to see the full error message
cessionsSelector.selectInfoRows = cessionsSelector.chunkCreator('info.rows');
// @ts-expect-error TS(2339): Property 'selectShowConfirm' does not exist on typ... Remove this comment to see the full error message
cessionsSelector.selectShowConfirm = cessionsSelector.chunkCreator('info.showConfirm');
// @ts-expect-error TS(2339): Property 'selectLastInfo' does not exist on type '... Remove this comment to see the full error message
cessionsSelector.selectLastInfo = cessionsSelector.chunkCreator('info.lastInfo');
// @ts-expect-error TS(2339): Property 'selectInfoCessionId' does not exist on t... Remove this comment to see the full error message
cessionsSelector.selectInfoCessionId = cessionsSelector.chunkCreator('info.cessionId');
// @ts-expect-error TS(2339): Property 'selectInfoShow' does not exist on type '... Remove this comment to see the full error message
cessionsSelector.selectInfoShow = cessionsSelector.chunkCreator('info.show');
// @ts-expect-error TS(2339): Property 'selectActiveCession' does not exist on t... Remove this comment to see the full error message
cessionsSelector.selectActiveCession = cessionsSelector.chunkCreator('info.activeCession');
// @ts-expect-error TS(2339): Property 'forceUpdate' does not exist on type 'Sel... Remove this comment to see the full error message
cessionsSelector.forceUpdate = cessionsSelector.chunkCreator('info.forceUpdateCounter');
// export const getCessionsSearchList = base('searchList');
// export const getCessionsLoading = base('loading');
// export const getCessionsList = base('list');
