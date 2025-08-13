/* 
<!DOCTYPE html>
<html>
....
    <script type="text/javascript">
      const data = 
'Headers;\n' + 
'1;;;Jack Walton;;;;;;11:59:50;;47:44;;;;;;;Course 1;;;;;;;;;;;;;;;;;;;;1;Course 1;;;40;;11:59:50;12:47:20;170;1:03;181;1:55;184;3:19;185;5:22;202;5:49;191;8:40;192;9:08;193;9:41;195;11:10;194;11:48;198;12:16;197;12:54;196;13:32;199;14:33;203;17:11;163;18:33;186;19:44;180;20:59;178;21:28;179;22:03;177;22:29;153;22:29;164;23:11;204;25:33;189;29:02;190;30:26;174;32:07;173;33:23;176;34:14;172;35:03;175;36:43;171;37:56;201;39:28;168;42:00;159;43:32;157;44:09;156;44:47;169;46:17;162;47:12;200;47:30;\n' +
'2;;;Alice Leake;;;;;;10:43:23;;48:30;;;;;;;Course 1;;;;;;;;;;;;;;;;;;;;1;Course 1;;;40;;10:43:23;11:31:40;170;1:05;181;2:12;184;3:42;185;5:51;202;6:23;191;9:21;192;9:48;193;10:24;195;11:59;194;12:41;198;13:10;197;13:52;196;14:27;199;15:15;203;17:30;163;18:56;186;20:04;180;21:32;178;21:59;179;22:21;177;22:45;153;22:45;164;23:29;204;26:16;189;28:14;190;29:49;174;31:51;173;33:16;176;34:10;172;35:04;175;36:57;171;38:17;201;39:58;168;42:24;159;43:59;157;44:44;156;45:20;169;46:56;162;47:57;200;48:17;\n' +
'3;;;Christopher Goddard;;;;;;11:19:23;;49:53;;;;;;;Course 1;;;;;;;;;;;;;;;;;;;;1;Course 1;;;40;;11:19:23;12:09:00;170;1:03;181;2:01;184;3:36;185;5:45;202;6:20;191;9:36;192;10:07;193;10:50;195;12:29;194;13:05;198;13:33;197;14:24;196;14:58;199;15:46;203;18:13;163;19:43;186;20:58;180;22:20;178;22:53;179;23:19;177;23:40;153;23:40;164;24:25;204;27:16;189;29:12;190;30:45;174;32:53;173;34:09;176;35:04;172;36:04;175;37:52;171;39:08;201;41:01;168;43:31;159;45:06;157;45:54;156;46:31;169;48:15;162;49:21;200;49:37;\n' +
...

'157;;;Lauren Martin;;;;;;11:03:59;;40:23;;;;;;;Course 7;;;;;;;;;;;;;;;;;;;;7;Course 7;;;13;;11:03:59;11:43:59;151;2:53;152;10:45;153;13:24;154;15:20;155;25:23;156;27:49;157;30:27;158;33:45;159;35:02;160;36:36;161;38:01;162;39:01;200;40:00;\n';
      SplitsBrowser.readEvent(data);
    </script>
    <noscript>
      <h1>SplitsBrowser &ndash; JavaScript is disabled</h1>

      <p>Your browser is set to disable JavaScript.</p>

      <p>SplitsBrowser cannot run if JavaScript is not enabled. Please enable JavaScript in your browser.</p>
    </noscript>
  </body>
</html>
*/

// const url = site.baseURL + "rg2/rg2api.php?type=events";


/** Loads results form a routegagdgte URL  */
import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGadgetResults {

  private rgUrl = signal<string>('');

  resource = httpResource.text(() => this.sbUrl(this.rgUrl()), {
    defaultValue: '',
    parse: (raw) => this.parseText(raw),
  });

  text = this.resource.value;
  loading = this.resource.isLoading;
  error = this.resource.error;

  load(url: string) {
    this.rgUrl.set(url);
  }

  /** Returns splitsbrowser url given url for Routegadget page */
  private sbUrl(url: string): string {
    const urlTree = new DefaultUrlSerializer().parse(url);

    const baseUrl = urlTree.root;
    const eventId = urlTree.queryParams['id'];

    return baseUrl + '/rg2api.php?type=splitsbrowser&id=' + eventId;
  }

  /** Parses raw splitsbrowser page from  */
  private parseText(text: string): string {
    const startIndex = text.indexOf("'Headers; \n' +");
    const endIndex = text.lastIndexOf("SplitsBrowser.readEvent(data)");
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Start or end of results data not found');
    }
    const ret = text.substring(startIndex, endIndex - 1);
    return ret;
  }
}