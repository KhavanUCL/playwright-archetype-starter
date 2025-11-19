import {test as baseTest} from './pom-fixture'
import CommonUtils from '../utils/commonUtils'

type CommonFixtureType = {
    commonUtils : CommonUtils;
}

export const test = baseTest.extend<CommonFixtureType>({
    commonUtils : async({},use)=>{
        use(new CommonUtils())
    }
})