import { TemplUtil } from "set-piece";
import { IRoleBuffModel } from "./i-role-buff";

@TemplUtil.is('role-buff')
export class RoleBuffModel extends IRoleBuffModel {
    constructor(props: RoleBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                offset: [0, 0],
                name: 'Unknown buff',
                desc: '+0/+0',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}