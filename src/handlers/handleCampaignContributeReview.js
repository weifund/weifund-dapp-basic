export default function handleCampaignContributeReview() {
  const campaignContributeID = el('#campaignFormID').value;
  const contributeAmount = el('#campaign_contributeAmount').value;
  const weifundContributeAmount = 0; // el('#campaign_weifundContributeAmount').value;
  var contributeTotal = parseFloat(contributeAmount, 10) + parseFloat(weifundContributeAmount, 10);

  if (isNaN(contributeTotal)) {
    contributeTotal = 0;
  }

  // parse float
  if (parseFloat(contributeAmount, 10) === 0) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign_contributeAmountGroup').style.border = `red solid 1px`;
    el('#campaign_contributeAmount').focus();
    el('#campaign_contributeAmount').blur();
    return;
  } else {
    el('#campaign-contribute-review-button').href = `/campaign/${campaignContributeID}/contribute/review`;
    el('#campaign_contributeAmountGroup').style.border = `none`;
  }

  // disclaimer check
  if (!el('#campaign-contribute-disclaimer').checked) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign-contribute-disclaimer').style.border = `red solid 1px`;
    el('#campaign-contribute-disclaimer').focus();
    el('#campaign-contribute-disclaimer').blur();
    return;
  } else {
    el('#campaign-contribute-review-button').href = `/campaign/${campaignContributeID}/contribute/review`;
    el('#campaign-contribute-disclaimer').style.border = `none`;
  }

  el('#campaign_contributeReview_contributeAmount').innerHTML = contributeAmount;
  el('#campaign_contributeReview_weifundContributeAmount').innerHTML = weifundContributeAmount;
  el('#campaign_contributeReview_totalContributeAmount').innerHTML = contributeTotal;
};
