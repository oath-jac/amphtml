import {mount} from 'enzyme';

import * as Preact from '#preact';

import {BaseCarousel} from '../../../amp-base-carousel/1.0/component';
import {LightboxGalleryProvider, WithLightbox} from '../component';
import {useStyles} from '../component.jss';

describes.sandboxed('LightboxGallery preact component', {}, () => {
  describe('LightboxGalleryProvider with children', () => {
    it('renders with WithLightbox', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <div key="3">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(3);

      // Elements are not rendered inside lightbox (closed).
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);
    });

    it('renders with WithLightbox[as]', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <WithLightbox key="3" as="img" id="with-as" />
          <div key="4">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
              <WithLightbox as="img" id="deeply-nested-with-as" />
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(4);
      expect(wrapper.find('img')).to.have.lengthOf(5);

      // Elements are not rendered inside lightbox (closed).
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);
    });

    it('opens with clones when clicking on a lightboxed element', () => {
      const classes = useStyles();
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <div key="3">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(3);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');
      expect(carousel.find('img')).to.have.lengthOf(2);
    });

    it('opens with rendered when given', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <WithLightbox key="3" as="img" id="with-as" render={renderImg} />
          <div key="4">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
              <WithLightbox
                as="img"
                id="deeply-nested-with-as"
                render={renderImg}
              />
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(4);
      expect(wrapper.find('img')).to.have.lengthOf(5);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');

      // Children are given to carousel
      expect(carousel.find('[data-slide=0] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=1] img').hasClass('rendered-img')).to.be
        .true;
      expect(carousel.find('[data-slide=2] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=3] img').hasClass('rendered-img')).to.be
        .true;
    });

    it('toggles to grid view', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <WithLightbox key="3" as="img" id="with-as" render={renderImg} />
          <div key="4">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
              <WithLightbox
                as="img"
                id="deeply-nested-with-as"
                render={renderImg}
              />
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI is not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel')).to.have.lengthOf(1);

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      const grid = wrapper.find(`.${classes.grid}`);
      expect(grid).to.have.lengthOf(1);

      // Children are cloned to grid
      const gridImgs = grid.find('img');
      expect(gridImgs).to.have.lengthOf(4);
      expect(gridImgs.at(0).hasClass('rendered-img')).to.be.false;
      expect(gridImgs.at(1).hasClass('rendered-img')).to.be.true;
      expect(gridImgs.at(2).hasClass('rendered-img')).to.be.false;
      expect(gridImgs.at(3).hasClass('rendered-img')).to.be.true;

      // Carousel is hidden, and its children still exist
      const carousel = wrapper.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('hidden')).to.be.true;
      // Children are given to carousel
      expect(carousel.find('[data-slide=0] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=1] img').hasClass('rendered-img')).to.be
        .true;
      expect(carousel.find('[data-slide=2] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=3] img').hasClass('rendered-img')).to.be
        .true;
    });

    it('toggles to grid view and back to carousel', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <WithLightbox key="3" as="img" id="with-as" render={renderImg} />
          <div key="4">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
              <WithLightbox
                as="img"
                id="deeply-nested-with-as"
                render={renderImg}
              />
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(1);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.true;

      // Toggle back to carousel UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;
    });

    it('toggles to specific carousel slide from grid view ', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <WithLightbox key="3" as="img" id="with-as" render={renderImg} />
          <div key="4">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
              <WithLightbox
                as="img"
                id="deeply-nested-with-as"
                render={renderImg}
              />
            </div>
          </div>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(1);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.true;

      // Click thumbnail item to go back to carousel UI
      wrapper.find(`.${classes.grid} div`).at(2).simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;
    });
  });

  describe('LightboxGalleryProvider with render prop', () => {
    it('renders with WithLightbox', () => {
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <div key="3">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(3);

      // Elements are not rendered inside lightbox (closed).
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);
    });

    it('renders with WithLightbox[as]', () => {
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <WithLightbox key="3" as="img" id="with-as" />,
        <div key="4">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
            <WithLightbox as="img" id="deeply-nested-with-as" />
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(4);
      expect(wrapper.find('img')).to.have.lengthOf(5);

      // Elements are not rendered inside lightbox (closed).
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);
    });

    it('opens with clones when clicking on a lightboxed element', () => {
      const classes = useStyles();
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <div key="3">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(3);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');
      expect(carousel.find('img')).to.have.lengthOf(2);
    });

    it('opens with rendered when given', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <WithLightbox key="3" as="img" id="with-as" render={renderImg} />,
        <div key="4">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
            <WithLightbox
              as="img"
              id="deeply-nested-with-as"
              render={renderImg}
            />
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Children are rendered inside provider.
      const provider = wrapper.find('Provider');
      expect(provider).to.have.lengthOf(1);
      expect(provider.children()).to.have.lengthOf(4);
      expect(wrapper.find('img')).to.have.lengthOf(5);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');

      // Children are given to carousel
      expect(carousel.find('[data-slide=0] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=1] img').hasClass('rendered-img')).to.be
        .true;
      expect(carousel.find('[data-slide=2] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=3] img').hasClass('rendered-img')).to.be
        .true;
    });

    it('toggles to grid view', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <WithLightbox key="3" as="img" id="with-as" render={renderImg} />,
        <div key="4">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
            <WithLightbox
              as="img"
              id="deeply-nested-with-as"
              render={renderImg}
            />
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI is not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel')).to.have.lengthOf(1);

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      const grid = wrapper.find(`.${classes.grid}`);
      expect(grid).to.have.lengthOf(1);

      // Children are cloned to grid
      const gridImgs = grid.find('img');
      expect(gridImgs).to.have.lengthOf(4);
      expect(gridImgs.at(0).hasClass('rendered-img')).to.be.false;
      expect(gridImgs.at(1).hasClass('rendered-img')).to.be.true;
      expect(gridImgs.at(2).hasClass('rendered-img')).to.be.false;
      expect(gridImgs.at(3).hasClass('rendered-img')).to.be.true;

      // Carousel is hidden, and its children still exist
      const carousel = wrapper.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('hidden')).to.be.true;
      expect(carousel.find('[data-slide=0] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=1] img').hasClass('rendered-img')).to.be
        .true;
      expect(carousel.find('[data-slide=2] img').hasClass('rendered-img')).to.be
        .false;
      expect(carousel.find('[data-slide=3] img').hasClass('rendered-img')).to.be
        .true;
    });

    it('toggles to grid view and back to carousel', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <WithLightbox key="3" as="img" id="with-as" render={renderImg} />,
        <div key="4">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
            <WithLightbox
              as="img"
              id="deeply-nested-with-as"
              render={renderImg}
            />
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(1);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.true;

      // Toggle back to carousel UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;
    });

    it('toggles to specific carousel slide from grid view ', () => {
      const classes = useStyles();
      const renderImg = () => <img class="rendered-img"></img>;
      const render = () => [
        <WithLightbox key="1" id="standard">
          <img />
        </WithLightbox>,
        <img key="2" id="no-lightbox" />,
        <WithLightbox key="3" as="img" id="with-as" render={renderImg} />,
        <div key="4">
          <div>
            <WithLightbox id="deeply-nested">
              <img />
            </WithLightbox>
            <WithLightbox
              as="img"
              id="deeply-nested-with-as"
              render={renderImg}
            />
          </div>
        </div>,
      ];
      const wrapper = mount(<LightboxGalleryProvider render={render} />);

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;

      // Toggle to grid UI
      toggleViewIcon.find('svg').simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(1);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.true;

      // Click thumbnail item to go back to carousel UI
      wrapper.find(`.${classes.grid} div`).at(2).simulate('click');
      wrapper.update();
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);
      expect(wrapper.find('BaseCarousel').prop('hidden')).to.be.false;
    });
  });

  describe('Grouping', () => {
    it('renders with WithLightbox', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <div key="3">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
            </div>
          </div>
          <BaseCarousel lightbox>
            <img key="4"></img>
            <img key="5"></img>
            <img key="6"></img>
          </BaseCarousel>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const providers = wrapper.find('Provider');
      // One from Lightbox, three for each carousel slide.
      expect(providers).to.have.lengthOf(4);
      const provider = providers.first();
      expect(provider.children()).to.have.lengthOf(4);

      // Elements are not rendered inside lightbox (closed).
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);
    });

    it('opens with clones when clicking on a lightboxed element in default group', () => {
      const classes = useStyles();
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <div key="3">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
            </div>
          </div>
          <BaseCarousel lightbox>
            <img key="4"></img>
            <img key="5"></img>
            <img key="6"></img>
          </BaseCarousel>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const providers = wrapper.find('Provider');
      // One from Lightbox, three for each carousel slide.
      expect(providers).to.have.lengthOf(4);
      const provider = providers.first();
      expect(provider.children()).to.have.lengthOf(4);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');
      expect(carousel.find('img')).to.have.lengthOf(2);
    });

    it('opens with clones when clicking on a lightboxed element in carousel group', () => {
      const classes = useStyles();
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox key="1" id="standard">
            <img />
          </WithLightbox>
          <img key="2" id="no-lightbox" />
          <div key="3">
            <div>
              <WithLightbox id="deeply-nested">
                <img />
              </WithLightbox>
            </div>
          </div>
          <BaseCarousel lightbox>
            <img key="4"></img>
            <img key="5"></img>
            <img key="6"></img>
          </BaseCarousel>
        </LightboxGalleryProvider>
      );

      // Children are rendered inside provider.
      const providers = wrapper.find('Provider');
      // One from Lightbox, three for each carousel slide.
      expect(providers).to.have.lengthOf(4);
      const provider = providers.first();
      expect(provider.children()).to.have.lengthOf(4);

      // Elements are not rendered inside lightbox (closed).
      let lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(0);

      // Note: We would normally click the first `img` element,
      // not its generated `div` wrapper. However, enzyme's
      // shallow renderer does not support event propagation as
      // we would expect in a real environment.
      wrapper.find('div[part="slide"]').first().simulate('click');
      wrapper.update();

      // Render provided children in the carousel group
      lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.prop('closeButtonAs').name).to.equal('CloseButtonIcon');
      expect(lightbox.children()).to.have.lengthOf(1);

      // Toggle control is rendered
      const toggleViewIcon = wrapper.find('ToggleViewIcon');
      expect(toggleViewIcon).to.have.lengthOf(1);
      expect(toggleViewIcon.prop('showCarousel')).to.be.true;

      // Grid UI not rendered
      expect(wrapper.find(`.${classes.grid}`)).to.have.lengthOf(0);

      // Carousel UI
      const carousel = lightbox.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      expect(carousel.prop('arrowPrevAs').name).to.equal('NavButtonIcon');
      expect(carousel.prop('arrowNextAs').name).to.equal('NavButtonIcon');
      expect(carousel.find('img')).to.have.lengthOf(3);
    });
  });

  describe('Captions', () => {
    it('should render with captions from caption, alt, and aria-label props', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox caption="First img">
            <img />
          </WithLightbox>
          <WithLightbox as="img" alt="Second img" />
          <WithLightbox
            as="section"
            aria-label="Third and fourth img group"
            render={() => <img />}
          >
            <img />
            <img />
          </WithLightbox>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(1);

      // Rendered elements
      expect(lightbox.find('img')).to.have.lengthOf(3);
      const caption = wrapper.find(`.amp-lightbox-gallery-caption`);
      expect(caption).to.have.lengthOf(1);
      expect(caption.text()).to.equal('First img');
    });

    it('should prefer caption to alt and aria-label props', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox caption="First img" alt="ignored" aria-label="ignored">
            <img />
          </WithLightbox>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(1);

      // Rendered elements
      expect(lightbox.find('img')).to.have.lengthOf(1);
      const caption = wrapper.find(`.amp-lightbox-gallery-caption`);
      expect(caption).to.have.lengthOf(1);
      expect(caption.text()).to.equal('First img');
    });

    it('should prefer alt to aria-label prop', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <WithLightbox alt="First img" aria-label="ignored">
            <img />
          </WithLightbox>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(1);

      // Rendered elements
      expect(lightbox.find('img')).to.have.lengthOf(1);
      const caption = wrapper.find(`.amp-lightbox-gallery-caption`);
      expect(caption).to.have.lengthOf(1);
      expect(caption.text()).to.equal('First img');
    });

    it('should take alt prop from carousel direct children', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <BaseCarousel lightbox>
            <img alt="First img" />
          </BaseCarousel>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div[part="slide"]').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(1);

      // Rendered elements
      expect(lightbox.find('img')).to.have.lengthOf(1);
      const caption = wrapper.find(`.amp-lightbox-gallery-caption`);
      expect(caption).to.have.lengthOf(1);
      expect(caption.text()).to.equal('First img');
    });

    it('should take aria-label prop from carousel direct children', () => {
      const wrapper = mount(
        <LightboxGalleryProvider>
          <BaseCarousel lightbox>
            <div role="img" aria-label="First img">
              <img />
            </div>
          </BaseCarousel>
        </LightboxGalleryProvider>
      );

      // Open lightbox
      wrapper.find('div[part="slide"]').first().simulate('click');
      wrapper.update();

      // Render provided children in the "default" (non-carousel) group
      const lightbox = wrapper.find('Lightbox');
      expect(lightbox).to.have.lengthOf(1);
      expect(lightbox.children()).to.have.lengthOf(1);

      // Rendered elements
      expect(lightbox.find('img')).to.have.lengthOf(1);
      const caption = wrapper.find(`.amp-lightbox-gallery-caption`);
      expect(caption).to.have.lengthOf(1);
      expect(caption.text()).to.equal('First img');
    });
  });
});
