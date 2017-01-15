import { parseMethodABIObject } from 'weifund-util';

// main export
export default function methodABIInputsForm(options) {
  // the output html
  var outputHTML = ``;

  // campagin object, method type, method abi object
  const t = options.t;
  const campaignObject = options.campaignObject;
  const methodType = options.methodType;
  const methodABIObject = parseMethodABIObject(methodType, campaignObject[`${methodType}MethodABIObject`]);

  // draw contribution inputs
  methodABIObject.inputs.forEach(function(methodInput, methodInputIndex) {
    // input html
    outputHTML += `

    <br />

    <h3>${methodInput.nameParsed}*</h3>
    <h4>This is a custom campaign input. The campaign operator has not set a description for this input.</h4>

    <br />

    `;

    // if type is a bool
    if (methodInput.kind === 'bool') {
      outputHTML += `

      <div class="row">
        <div class="col-xs-12 col-sm-12">
          <select id="${methodInput.id}" placeholder="${methodInput.name}">
            <option value="0">False (no)</option>
            <option value="1">True (yes)</option>
           </select>
        </div>
      </div>

       `;
    } else if (methodInput.kind === 'number') {

      if (methodInput.usesSlider) {

        outputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="input-slider input-slider-lg" data-input-id="${methodInput.id}">
              <div class="input-slider-rail">
                <div class="input-slider-rail-highlight"></div>
                <div class="input-slider-bar"></div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="input-group">
              <input type="text" id="${methodInput.id}" class="form-control input-lg" placeholder="i.e. 400" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">${methodInput.units}</span>
            </div>
          </div>
        </div>

        `;

      } else {
        outputHTML += `

        <div class="row">
          <div class="col-xs-12">
            <div class="input-group">
              <input type="text" id="${methodInput.id}" class="form-control input-lg" placeholder="i.e. 30" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">${methodInput.units}</span>
            </div>
          </div>
        </div>

        `;
      }
    } else {
      outputHTML += `

      <div class="row">
        <div class="col-xs-12 col-sm-12">
          <input type="${methodInput.kind}" id="${methodInput.id}" placeholder="${methodInput.nameParsed}" />
        </div>
      </div>

      `;
    }
  });

  return outputHTML;
}
