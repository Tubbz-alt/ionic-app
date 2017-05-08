import { NavParams, ViewController, Platform } from 'ionic-angular';
import { Component }        from '@angular/core';
import { DomSanitizer }     from "@angular/platform-browser";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CasquesService }   from "../../providers/casques-service";
import { PromptService }    from "../../providers/prompt-service";

@Component({
    selector: 'page-casque',
    templateUrl: 'casque.html'
})
export class CasquePage {

    private postId:string;
    private casque:any;

    constructor(private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CasquesService,
                private domSanitizer: DomSanitizer,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

        this.postId = this.navParams.get('postId');
    }

    ionViewDidLoad() {
        this.api.getCasque(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.casque = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentError(error.toString());
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.casque === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    onExternalLink() {
        this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les casques', this.casque.permalink);
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
