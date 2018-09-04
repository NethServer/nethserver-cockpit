<template>
  <div>
    <h2>{{$t('wizard.title')}}</h2>

    <div class="modal" id="firstConfigWizard" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog modal-lg wizard-pf">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">First Configuration Wizard</h4>
          </div>
          <div class="modal-body wizard-pf-body clearfix">
            <div class="wizard-pf-steps">
              <ul class="wizard-pf-steps-indicator wizard-pf-steps-alt-indicator active">

                <li :class="['wizard-pf-step', currentStep == 1 ? 'active' : '']">
                  <a>
                    <span class="wizard-pf-step-number">1</span>
                    <span class="wizard-pf-step-title">Welcome</span>
                    <span class="wizard-pf-step-title-substep">welcome</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep > 1 && currentStep < 8 ? 'active' : '']">
                  <a>
                    <span class="wizard-pf-step-number">2</span>
                    <span class="wizard-pf-step-title">Settings</span>
                    <span class="wizard-pf-step-title-substep">root</span>
                    <span class="wizard-pf-step-title-substep">restore</span>
                    <span class="wizard-pf-step-title-substep">hostname</span>
                    <span class="wizard-pf-step-title-substep">datetime</span>
                    <span class="wizard-pf-step-title-substep">security</span>
                    <span class="wizard-pf-step-title-substep">network</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep == 8 ? 'active' : '']">
                  <a>
                    <span class="wizard-pf-step-number">3</span>
                    <span class="wizard-pf-step-title">Review</span>
                    <span class="wizard-pf-step-title-substep">summary</span>
                  </a>
                </li>
              </ul>

              <ul class="wizard-pf-steps-alt">
                <li class="wizard-pf-step-alt viewed">
                  <a>
                    <span class="wizard-pf-step-alt-number">1</span>
                    <span class="wizard-pf-step-alt-title">Welcome</span>
                  </a>
                  <ul>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 1 ? 'active' : '']">
                      <a href="">Welcome</a>
                    </li>
                  </ul>
                </li>

                <li class="wizard-pf-step-alt">
                  <a>
                    <span class="wizard-pf-step-alt-number">2</span>
                    <span class="wizard-pf-step-alt-title">Settings</span>
                  </a>
                  <ul class="hidden">
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 2 ? 'active' : '']">
                      <a>Password</a>
                    </li>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 3 ? 'active' : '']">
                      <a>Restore</a>
                    </li>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 4 ? 'active' : '']">
                      <a>Hostname</a>
                    </li>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 5 ? 'active' : '']">
                      <a>Date & Time</a>
                    </li>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 6 ? 'active' : '']">
                      <a>Security</a>
                    </li>
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 7 ? 'active' : '']">
                      <a>Network</a>
                    </li>
                  </ul>
                </li>

                <li class="wizard-pf-step-alt">
                  <a>
                    <span class="wizard-pf-step-alt-number">3</span>
                    <span class="wizard-pf-step-alt-title">Review</span>
                  </a>
                  <ul class="hidden">
                    <li :class="['wizard-pf-step-alt-substep', currentStep == 8 ? 'active' : '']">
                      <a>Summary</a>
                    </li>
                  </ul>
                </li>

              </ul>
            </div>

            <div class="wizard-pf-row">
              <div class="wizard-pf-sidebar">
                <ul :class="['list-group', currentStep == 1 ? '' : 'hidden']">
                  <li :class="['list-group-item', currentStep == 1 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Welcome</span>
                    </a>
                  </li>
                </ul>
                <ul :class="['list-group', currentStep > 1 && currentStep < 8 ? '' : 'hidden']">
                  <li :class="['list-group-item', currentStep == 2 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Password</span>
                    </a>
                  </li>
                  <li :class="['list-group-item', currentStep == 3 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Restore</span>
                    </a>
                  </li>
                  <li :class="['list-group-item', currentStep == 4 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Hostname</span>
                    </a>
                  </li>
                  <li :class="['list-group-item', currentStep == 5 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Date & Time</span>
                    </a>
                  </li>
                  <li :class="['list-group-item', currentStep == 6 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Security</span>
                    </a>
                  </li>
                  <li :class="['list-group-item', currentStep == 7 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Network</span>
                    </a>
                  </li>
                </ul>
                <ul :class="['list-group', currentStep == 8 ? '' : 'hidden']">
                  <li :class="['list-group-item', currentStep == 8 ? 'active' : '']">
                    <a>
                      <span class="wizard-pf-substep-title">Summary</span>
                    </a>
                  </li>
                </ul>
              </div>
              <!-- /.wizard-pf-sidebar -->
              <div class="wizard-pf-main">

                <div :class="['wizard-pf-contents', currentStep == 1 ? '' : 'hidden']">
                  <div class="wizard-pf-complete blank-slate-pf">
                    <div class="wizard-pf-success-icon">
                      <img class="icon-wizard" src="./../assets/icon.png" />
                    </div>
                    <h3 class="blank-slate-pf-main-action">Welcome to NethServer 7.4.1708 Final</h3>
                    <p class="blank-slate-pf-secondary-action">This wizard will help you setup some system options. At the end, you will redirected to the admin dashboard</p>
                    <button @click="nextStep()" type="button" class="btn btn-lg btn-primary">
                      Start Wizard
                    </button>
                  </div>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 2 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Password</h3>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">New password</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label" for="dolor">Confirm new password</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 3 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Restore configuration</h3>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="aliquam">Restore configuration from backup file</label>
                      <div class="col-sm-9">
                        <input type="checkbox" class="form-control">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label" for="fermentum">Select .tar.xz file</label>
                      <div class="col-sm-9">
                        <input type="file" class="inputfile">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label" for="fermentum">Download modules</label>
                      <div class="col-sm-9">
                        <input type="checkbox" class="form-control">
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 4 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Insert FQDN</h3>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">Hostname</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 5 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Date & Time</h3>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">Timezone</label>
                      <div class="col-sm-9">
                        <select class="form-control">
                          <option>Rome</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 6 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Security</h3>

                  <h4 class="adjust-top">SSH</h4>
                  <div class="alert alert-warning alert-dismissable">
                    <span class="pficon pficon-warning-triangle-o"></span>
                    <strong>Change the default port</strong> The SSH service by default uses port 22. Using this value does not make
                    your system insecure, however, changing the default SSH port will stop many automated attacks.
                  </div>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">TCP Port</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </form>
                  <h4 class="adjust-top">Admin Dashboard</h4>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">Limit access to :980 port</label>
                      <div class="col-sm-9">
                        <input type="checkbox" class="form-control">
                      </div>
                    </div>

                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">Public IPs (comma separated)</label>
                      <div class="col-sm-9">
                        <input type="input" class="form-control">
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 7 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Network</h3>
                  <form class="form-horizontal">
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">This server is a gateway?</label>
                      <div class="col-sm-9">
                        <input type="checkbox" class="form-control">
                      </div>
                    </div>
                    <div class="form-group required">
                      <label class="col-sm-3 control-label" for="lorem">Choose <span class="red">RED</span> interface</label>
                      <div class="col-sm-9">
                        <select class="form-control">
                          <option>eth0</option>
                          <option>eth1</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', currentStep == 8 ? '' : 'hidden']">
                  <h3 class="no-margin-top">Review changes</h3>

                  <div class="wizard-pf-complete blank-slate-pf">
                    <h4 class="blank-slate-pf-main-action">Apply the following changes:</h4>
                    <ul class="">
                      <li @click="setStep(2)" class="wizard-pf-step-alt-substep active review-li-wizard">
                        <a>Password</a>
                      </li>
                      <li @click="setStep(4)" class="wizard-pf-step-alt-substep active review-li-wizard">
                        <a>Hostname</a>
                      </li>
                      <li @click="setStep(6)" class="wizard-pf-step-alt-substep active review-li-wizard">
                        <a>Security</a>
                      </li>
                    </ul>
                    <button type="button" class="btn btn-lg btn-primary">
                      Apply configurations
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer wizard-pf-footer">
            <button v-if="currentStep != 1" @click="prevStep()" type="button" :class="['btn btn-default wizard-pf-back', currentStep == 1 ? 'disabled' : '']">
              <span class="i fa fa-angle-left"></span>
              Back
            </button>
            <button v-if="currentStep != 1 && currentStep != 8" @click="nextStep()" type="button" :class="['btn btn-primary wizard-pf-next', currentStep == 8 ? 'disabled' : '']">
              Next
              <span class="i fa fa-angle-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Wizard",
  mounted() {
    $("#firstConfigWizard").modal("show");
  },
  data() {
    return {
      currentStep: 1
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < 8) this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    setStep(step) {
      this.currentStep = step;
    }
  }
};
</script>

<style>

</style>
