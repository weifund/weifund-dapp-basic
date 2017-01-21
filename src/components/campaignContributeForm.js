import yo from 'yo-yo';
import BigNumber from 'bignumber.js';
import { etherScanAddressUrl } from 'weifund-util';

import campaignContributeNav from './campaignContributeNav';
import { getNetwork, txObject } from '../environment';
import { web3 } from '../web3';

export default function campaignContributeForm(options) {
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;
  const gasPrice = web3.toWei('0.00000002', 'ether');
  const actualGasCost = (new BigNumber(txObject().gas)).times(gasPrice);
  const t = options.t;

  return yo`<div>
  <div id="view-campaign-contribute-form" class="row center-block container"
    style="margin-top: 80px; margin-bottom: 150px;">
    <div class="col-xs-12 col-sm-6 col-md-8 no-border-xs no-border-sm"
      style="padding-right: 50px;">
      <h3>Contribution Amount</h3>
      <h4>Please select the amount you want to contribute to this campaign.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg"
            id="campaign_contributeSlider"
            data-value-max="1"
            data-input-id="campaign_contributeAmount">
            <div class="input-slider-rail">
              <div id="contribute-highlight-rail" class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <div class="input-group" id="campaign_contributeAmountGroup">
            <input type="text" id="campaign_contributeAmount" value="0.125"
              class="form-control input-lg" placeholder="i.e. 1" aria-describedby="basic-addon2" />
            <span class="input-group-addon" id="basic-addon2">ether</span>
          </div>
        </div>
      </div>

      <input type="hidden" id="campaignFormID" value="${campaignObject.id}" />

      <div id="campaignContribution_inputs">
      </div>

      <br />

      <h3>Terms of Use</h3>
      <p>You must read and agree to this Terms of Use before contributing to this campaign.</p>
      <div style="padding: 20px; background: #FFF; overflow: auto; border: 1px solid #aaa; height: 250px;">
        <h1 id='cUQACACWcq3'>WeiFund Terms of Use</h1>

<b><b>Terms of Use version 1</b></b><br />

Our Terms of Use have been updated as of January 1, 2017<br />

<b><b>IMPORTANT NOTICE: </b></b>THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN SECTION 14. PLEASE READ THE AGREEMENT CAREFULLY.<br />

 <br />

<b><b>1. Acceptance of terms</b></b><br />

WeiFund provides a platform for cryptocurrency based funding campaigns, through our website located at <a href="https://weifund.io/">https://weifund.io/</a> and https://weifund.surge.sh (the "Sites") which includes text, images, audio, code and other materials or third party information accessible through WeiFund (collectively, the “Content”) and all of the features, and services provided. The Sites and any other features, tools, materials, or other services offered from time to time by WeiFund are referred to here as the “Service.” Please read these Terms of Use (the “Terms” or “Terms of Use”) carefully before using the Service. By using or otherwise accessing the Services, or clicking to accept or agree to these Terms where that option is made available, you (1) accept and agree to these Terms (2) consent to the collection, use, disclosure and other handling of information as described in our Privacy Policy and (3) any additional terms, rules and conditions of participation issued by WeiFund from time to time. If you do not agree to the Terms, then you may not access or use the Content or Services.<br />

<br />

YOU ACKNOWLEDGE THAT THESE TERMS OF SERVICE APPLY TO CAMPAIGNS HOSTED DIRECTLY BY WEIFUND ON OUR SITES. CAMPAIGNS RUN BY THIRD PARTIES USING WEIFUND SOFTWARE MAY INHERENTLY BE OUTSIDE THE CONTROL OF WEIFUND. PLEASE REFER TO ANY THIRD PARTY CAMPAIGNER'S TERMS IN SUCH INSTANCES. WEIFUND IS NOT LIABLE FOR YOUR INTERACTION WITH ANY THIRD PARTY CAMPAIGN AS SPECIFIED IN THIS DOCUMENT.<br />

<br />

<b><b>2. Modification of Terms of Use</b></b><br />

Except for Section 14, providing for binding arbitration and waiver of class action rights, WeiFund reserves the right, at its sole discretion, to modify or replace the Terms of Use at any time. The most current version of these Terms will be posted on our Sites. You shall be responsible for reviewing and becoming familiar with any such modifications. Use of the Services by you after any modification to the Terms constitutes your acceptance of the Terms of Use as modified.<br />

 <br />

<b><b>3. Eligibility</b></b><br />

You hereby represent and warrant that you are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in these Terms and to abide by and comply with these Terms.<br />

WeiFund is a global platform and by accessing the Content or Services, you are representing and warranting that, you are of the legal age of majority in your jurisdiction or of the age required to access such Services and Content. You further represent that you are otherwise legally permitted to use the service in your jurisdiction including owning cryptographic tokens of value, and interacting with the Services or Content in any way. You further represent you are responsible for ensuring compliance with the laws of your jurisdiction and acknowledge that WeiFund is not liable for your compliance with such laws. <br />

<br />

<b><b>4. REPRESENTATIONS, WARRANTIES AND RISKS</b></b><br />

<br />

<b><b>4.1. Warranty disclaimer</b></b><br />

You expressly understand and agree that your use of the Service is at your sole risk. The Service (including the Service and the Content) is provided on an "AS IS" and "as available" basis, without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose or non-infringement. You acknowledge that WeiFund has no control over, and no duty to take any action regarding: which users gain access to or use the Service; what effects the Content may have on you; how you may interpret or use the Content; or what actions you may take as a result of having been exposed to the Content. You release WeiFund from all liability for you having acquired or not acquired Content through the Service. WeiFund makes no representations concerning any Content contained in or accessed through the Service, and WeiFund will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Service.<br />

<br />

<b><b>4.2 Sophistication and Risk of Cryptographic Systems</b></b><br />

By utilizing the Service or interacting with the Content or platform in any way, you represent that you understand the inherent risks associated with cryptographic systems; and warrant that you have an understanding of the usage and intricacies of public/private key cryptography, native cryptographic tokens, like Ether (ETH) and Bitcoin (BTC), smart contract based tokens such as those that follow the Ethereum Token Standard (https://github.com/ethereum/EIPs/issues/20), and blockchain-based software systems. <br />

 <br />

<b><b>4.3 Risk of Weaknesses or Exploits in the Field of Cryptography</b></b><br />

You acknowledge and understand that Cryptography is a progressing field. Advances in code cracking or technical advances such as the development of quantum computers may present risks to cryptographic systems and Services or Content, which could result in the theft or loss of your cryptographic tokens or property. To the extent possible, WeiFund intends to update the code underlying the Services to account for any advances in cryptography and to incorporate additional security measures, but does not guarantee or otherwise represent full security of the system. By using the Service or accessing Content, you acknowledge these inherent risks.<br />

<br />

<b><b>4.4 Platform Security</b></b><br />

You acknowledge that Ethereum applications are code subject to flaws and acknowledge that you are solely responsible for evaluating any available code provided by the Services or Content and the trustworthiness of any third-party websites, products, smart-contracts, or Content you access or use through the Service. You further expressly acknowledge and represent that Ethereum applications can be written maliciously or negligently, that WeiFund cannot be held liable for your interaction with such applications and that such applications may cause loss of property or identity. Information relayed to IPFS and stored in contracts is currently unencrypted. Malicious actors may potentially access information such as name, photo, description, and members of your recovery network, presenting both disclosure and potential security risks. These warnings and others later provided by WeiFund in no way evidence or represent an on-going duty to alert you to all of the potential risks of utilizing the Service or Content.<br />

<br />

<b><b>4.5 Risk of Regulatory Actions in One or More Jurisdictions</b></b><br />

You acknowledge that as an emerging technology, WeiFund or Ethereum could be impacted by one or more regulatory inquiries or regulatory actions, which could impede or limit the ability of WeiFund to continue to develop, or which could impede or limit your ability to access or use the Service or Ethereum blockchain. <br />

<br />

WeiFund is innovative software designed to facilitate secure cryptocurrency based campaigns. Due to the regulatory uncertainty in this area, WeiFund makes no representations regarding the legality of any individual campaign facilitated through WeiFund software. WeiFund, will, at all times, comply with any regulator inquiries. You represent that you acknowledge the legal and regulatory risks potentially associated with campaigns run through WeiFund software and that you are solely responsible for your compliance with the relevant laws of your jurisdiction.<br />

<br />

<b><b>5. Indemnity</b></b><br />

You agree to release and to indemnify, defend and hold harmless WeiFund and its parents, subsidiaries, affiliates and agencies, as well as the officers, directors, employees, shareholders and representatives of any of the foregoing entities, from and against any and all losses, liabilities, expenses, damages, costs (including attorneys’ fees and court costs) claims or actions of any kind whatsoever arising or resulting from your use of the Service, your violation of these Terms of Use, and any of your acts or omissions that implicate publicity rights, defamation or invasion of privacy. WeiFund reserves the right, at its own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by you and, in such case, you agree to cooperate with WeiFund in the defense of such matter.<br />

 <br />

<b><b>6. Limitation on liability</b></b><br />

YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR YOUR USE OF THE SITES AND SERVICE. YOU ACKNOWLEDGE AND AGREE THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITES AND SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SITES AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING SUCH, YOU UNDERSTAND AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER WEIFUND NOR ITS SUPPLIERS OR LICENSORS WILL BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT, TORT, STRICT LIABILITY OR ANY OTHER THEORY (EVEN IF WEIFUND HAD BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE SITES OR SERVICE; THE USE OR THE INABILITY TO USE THE SITES OR SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SITES OR SERVICE; ANY ACTIONS WE TAKE OR FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND TO US; HUMAN ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY OR TELEPHONE OUTAGES; OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE TO COMPUTER EQUIPMENT; INABILITY TO FULLY ACCESS THE SITES OR SERVICE OR ANY OTHER WEBSITE; THEFT, TAMPERING, DESTRUCTION, OR UNAUTHORIZED ACCESS TO, IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR INCORRECTLY OR IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR ANY COMBINATION THEREOF; OR ANY OTHER MATTER RELATING TO THE SITES OR SERVICE. <br />

<br />

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.<br />

<br />

<b><b>7. Licenses and Access</b></b><br />

Subject to your compliance with these Terms of Use, WeiFund grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and make personal and non-commercial use of the Service. This license does not include any resale or commercial use of the Service or any derivative use of the Service. All rights not expressly granted to you in these Terms of Use are reserved and retained by WeiFund or its licensors. The WeiFund Service may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of WeiFund. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of WeiFund without express written consent. You may not misuse the Services. You may use the Services only as permitted by law. The licenses granted by WeiFund terminate if you do not comply with these Terms of Use.<br />

<br />

For more information regarding WeiFund's licensors, WeiFund maintains this information on our attribution page found here: <br />

<br />

<b><b>8. Links or Third Party Applications</b></b><br />

The Service provides, or third parties may provide, links to other World Wide Web  or accessible sites, applications or resources. Because WeiFund has no control over such sites, applications and resources, you acknowledge and agree that WeiFund is not responsible for the availability of such external sites, applications or resources, and does not endorse and is not responsible or liable for any content, advertising, products or other materials on or available from such sites or resources. You further acknowledge and agree that WeiFund shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such site or resource.<br />

<br />

<b><b>9. Termination and suspension</b></b><br />

WeiFund may terminate or suspend all or part of the Service and your WeiFund access immediately, without prior notice or liability, if you breach any of the terms or conditions of the Terms. Upon termination of your access, your right to use the Service will immediately cease.<br />

<br />

The following provisions of the Terms survive any termination of these Terms: INDEMNITY; WARRANTY DISCLAIMERS; LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS; LINKS; TERMINATION; NO THIRD PARTY BENEFICIARIES; BINDING ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.<br />

<br />

<b><b>10. No third party beneficiaries</b></b><br />

You agree that, except as otherwise expressly provided in these Terms, there shall be no third party beneficiaries to the Terms.<br />

<br />

<b><b>11. Notice and procedure for making claims of copyright infringement</b></b><br />

WeiFund (“we” or “us”) responds to notices of alleged infringement as required by the U.S. Digital Millennium Copyright “ DMCA”, including by removing or disabling access to material claimed to be infringing or to be the subject of infringing activity. WeiFund's Designated Copyright Agent (identified below) will only respond to notices, counter-notifications and inquiries that comply with the requirements of the DMCA. <br />

 <br />

Reporting Copyright Infringement: If you have a good faith belief that your work has been copied in a way that constitutes copyright infringement on or through the WeiFund Services, please send a notice of copyright infringement (“Notice”) to WeiFund's Designated Copyright Agent. Your Notice must be in writing and include the following information: <br />

 <br />

1. Identification of the copyrighted work or material that you claim has been infringed. If this material exists online, please provide a URL.<br />

2. Identification of the material that is claimed to be infringing, including its location on WeiFund, with sufficient detail so that WeiFund is capable of finding the material and verifying its existence ( e.g. , in most circumstances, we will need a URL or screen capture). <br />

3. Contact information, including your name, address, telephone number and email address. <br />

4. A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner or its agent or law. <br />

5. A statement by you that the above information in your Notice is accurate and that, under penalty of perjury, you are the copyright owner or authorized to act on the copyright owner's behalf. <br />

6. A physical or electronic signature of the owner of the copyright that has been allegedly infringed or a person authorized to act on behalf of the owner. <br />

 <br />

The WeiFund Privacy Policy does not protect information provided in a Notice. <br />

 <br />

DMCA Copyright Notice:mail@weifund.io<br />

 <br />

<b><b>12. Binding arbitration and class action waiver</b></b><br />

PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT<br />

<br />

<b><b>12.1 Initial Dispute Resolution</b></b><br />

The parties shall use their best efforts to engage directly to settle any dispute, claim, question, or disagreement and engage in good faith negotiations which shall be a condition to either party initiating a lawsuit or arbitration.<br />

<br />

<b><b>12.2 Binding Arbitration</b></b><br />

If the parties do not reach an agreed upon solution within a period of 30 days from the time informal dispute resolution under the Initial Dispute Resolution provision begins, then either party may initiate binding arbitration as the sole means to resolve claims, subject to the terms set forth below. Specifically, all claims arising out of or relating to these Terms (including their formation, performance and breach), the parties’ relationship with each other and/or your use of the Service shall be finally settled by binding arbitration administered by the American Arbitration Association in accordance with the provisions of its Commercial Arbitration Rules and the supplementary procedures for consumer related disputes of the American Arbitration Association (the “AAA”), excluding any rules or procedures governing or permitting class actions.<br />

The arbitrator, and not any federal, state or local court or agency, shall have exclusive authority to resolve all disputes arising out of or relating to the interpretation, applicability, enforceability or formation of these Terms, including, but not limited to any claim that all or any part of these Terms are void or voidable, or whether a claim is subject to arbitration. The arbitrator shall be empowered to grant whatever relief would be available in a court under law or in equity. The arbitrator’s award shall be written, and binding on the parties and may be entered as a judgment in any court of competent jurisdiction.<br />

The parties understand that, absent this mandatory provision, they would have the right to sue in court and have a jury trial. They further understand that, in some instances, the costs of arbitration could exceed the costs of litigation and the right to discovery may be more limited in arbitration than in court.<br />

<br />

<b><b>12.3 Location</b></b><br />

Binding arbitration shall take place in New York. You agree to submit to the personal jurisdiction of any federal or state court in New York County, New York, in order to compel arbitration, to stay proceedings pending arbitration, or to confirm, modify, vacate or enter judgment on the award entered by the arbitrator.<br />

<br />

<b><b>12.4 Class Action Waiver</b></b><br />

The parties further agree that any arbitration shall be conducted in their individual capacities only and not as a class action or other representative action, and the parties expressly waive their right to file a class action or seek relief on a class basis. <br />

<br />

YOU AND WEIFUND AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. <br />

<br />

If any court or arbitrator determines that the class action waiver set forth in this paragraph is void or unenforceable for any reason or that an arbitration can proceed on a class basis, then the arbitration provision set forth above shall be deemed null and void in its entirety and the parties shall be deemed to have not agreed to arbitrate disputes.<br />

<br />

<b><b>12.5 Exception - Litigation of Intellectual Property and Small Claims Court Claims</b></b><br />

Notwithstanding the parties' decision to resolve all disputes through arbitration, either party may bring an action in state or federal court to protect its intellectual property rights (“intellectual property rights” means patents, copyrights, moral rights, trademarks, and trade secrets, but not privacy or publicity rights). Either party may also seek relief in a small claims court for disputes or claims within the scope of that court’s jurisdiction.<br />

<br />

<b><b>12.6 30-Day Right to Opt Out</b></b><br />

You have the right to opt-out and not be bound by the arbitration and class action waiver provisions set forth above by sending written notice of your decision to opt-out to the following address: WeiFund ℅ ConsenSys, 49 Bogart Street, Brooklyn NY 11206 and via email at legal@weifund.io. The notice must be sent within 30 days of September 6, 2016 or your first use of the Service, whichever is later, otherwise you shall be bound to arbitrate disputes in accordance with the terms of those paragraphs. If you opt-out of these arbitration provisions, WeiFund also will not be bound by them.<br />

<br />

<b><b>12.7 Changes to this Section</b></b><br />

WeiFund will provide 60-days’ notice of any changes to this section. Changes will become effective on the 60th day, and will apply prospectively only to any claims arising after the 60th day. For any dispute not subject to arbitration you and WeiFund agree to submit to the personal and exclusive jurisdiction of and venue in the federal and state courts located in New York, New York. You further agree to accept service of process by mail, and hereby waive any and all jurisdictional and venue defenses otherwise available. The Terms and the relationship between you and WeiFund shall be governed by the laws of the State of New York without regard to conflict of law provisions.<br />

<br />

<b><b>13. GENERAL INFORMATION</b></b><br />

<b><b>13.1 Entire Agreement</b></b><br />

These Terms (and any additional terms, rules and conditions of participation that WeiFund may post on the Service) constitute the entire agreement between you and WeiFund with respect to the Service and supersedes any prior agreements, oral or written, between you and WeiFund . In the event of a conflict between these Terms and the additional terms, rules and conditions of participation, the latter will prevail over the Terms to the extent of the conflict.<br />

<br />

<b><b>13.2 Waiver and Severability of Terms</b></b><br />

The failure of WeiFund to exercise or enforce any right or provision of the Terms shall not constitute a waiver of such right or provision. If any provision of the Terms is found by an arbitrator or court of competent jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should endeavor to give effect to the parties' intentions as reflected in the provision, and the other provisions of the Terms remain in full force and effect.<br />

<br />

<b><b>13.3 Statute of Limitations</b></b><br />

You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Service or the Terms must be filed within one (1) year after such claim or cause of action arose or be forever barred.<br />

<br />

<b><b>13.4 Section Titles</b></b><br />

The section titles in the Terms are for convenience only and have no legal or contractual effect.<br />

<br />

<b><b>13.5 Communications</b></b><br />

Users with questions, complaints or claims with respect to the Service may contact us at info@weifund.io. <br />

<br />

<br />

 <br />
      </div>
      <br />
      <input type="checkbox" id="campaign-contribute-disclaimer" placeholder="i.e. 400" />
      By checking this box, you agree to the WeiFund disclaimer.
      <br />
      <br />
      <br />
      <br />
      <button id="campaign-contribute-review-button" class="btn btn-primary btn-lg">
        Review Contribution
      </button>
      <br /><br />
      <div id="campaign-contribute-form-response"
        class="alert alert-dismissible alert-warning" style="display: none;">
        <h4>Warning!</h4>
        <p></p>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 no-padding-xs text-break-all"
      style="border-left: 3px solid #E1E1E1; padding-left: 50px;">
      <h3>Technical Details</h3>
      <br />
      <h4>Network</h4>
      <h5>Ethereum (ETH) ${getNetwork()} Network*</h5>
      <br />
      <h4>Selected Account</h4>
      <h5 id="defaultAccountAddress">0x</h5>
      <br />
      <h4>Selected Account Balance</h4>
      <h5><span id="defaultAccountBalance">0</span> Ether (ETH)</h5>
      <br />
      <h4>Token Price</h4>
      <h5><span>0.125</span> Ether (ETH)</h5>
      <br />
      <h4>Approx. Gas Cost</h4>
      <h5><span>${web3.fromWei(actualGasCost, 'ether').toString(10)}</span> Ether (ETH)</h5>
      <br />
      <h4>Contract Address</h4>
      <h5>${campaignObject.addr}</h5>
      <br />
      <h4>Contract ABI</h4>
      <pre style="height: 150px; overflow: scroll;">${
        JSON.stringify(campaignObject.abi, null, 2)
      }</pre>
      <br />
      <h4>Contribute Method ABI</h4>
      <h5>${campaignObject.contributeMethodABI}</h5>
      <br />
      <h4>Provider</h4>
      <h5>Hooked Web3 Provider</h5>
    </div>
    ${campaignContributeNav({
      backURL: `/campaign/${options.campaignObject.id}/contribute/`,
      showNextButton: false,
    })}
  </div></div>`;
}
