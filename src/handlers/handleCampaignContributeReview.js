import yo from 'yo-yo';
import { el } from '../document';

export default function handleCampaignContributeReview() {
  const campaignContributeID = el('#campaignFormID').value;
  const contributeAmount = el('#campaign_contributeAmount').value;
  var contributeTotal = parseFloat(contributeAmount, 10);

  if (isNaN(contributeTotal)) {
    contributeTotal = 0;
  }

  // parse float
  if (parseFloat(contributeAmount, 10) === 0) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign_contributeAmountGroup').style.border = `red solid 1px`;
    el('#campaign_contributeAmount').focus();
    el('#campaign_contributeAmount').blur();

    // promt error
    el('#campaign-contribute-form-response').innerHTML = '';
    el('#campaign-contribute-form-response').style.display = 'block';
    el('#campaign-contribute-form-response').appendChild(yo`<span>
      <h2>Invalid Contribution Amount</h2>
      <p>You must select a contribution amount greater than zero Ether.</p>
    </span>`);

    return;
  } else {
    el('#campaign_contributeAmountGroup').style.border = `none`;
  }

  // disclaimer check
  if (!el('#campaign-contribute-disclaimer').checked) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign-contribute-disclaimer').style.border = `red solid 1px`;
    el('#campaign-contribute-disclaimer').focus();
    el('#campaign-contribute-disclaimer').blur();

    // prompt error
    el('#campaign-contribute-form-response').innerHTML = '';
    el('#campaign-contribute-form-response').style.display = 'block';
    el('#campaign-contribute-form-response').appendChild(yo`<span>
      <h2>Mandatory Disclaimer</h2>
      <p>In order to contribute through WeiFund, you must agree to the disclaimer.</p>
    </span>`);

    return;
  } else {
    el('#campaign-contribute-disclaimer').style.border = `none`;
  }

  el('#campaign-contribute-form-response').style.display = 'none';
  el('#campaign_contributeReview_contributeAmount').innerHTML = contributeAmount;
  el('#campaign_contributeReview_totalContributeAmount').innerHTML = contributeTotal;

  // return true;
  return true;
};
