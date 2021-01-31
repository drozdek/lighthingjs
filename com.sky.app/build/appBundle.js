/**
 * App version: 1.0.0
 * SDK version: 4.0.0
 * CLI version: 2.3.4
 * 
 * Generated: Sun, 31 Jan 2021 16:27:05 GMT
 */

var APP_com_sky_app = (function () {
  'use strict';

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const settings = {};
  const subscribers = {};

  const publish = (key, value) => {
    subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value));
  };

  const dotGrab = (obj = {}, key) => {
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
    }
    return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
  };

  var Settings = {
    get(type, key, fallback = undefined) {
      const val = dotGrab(settings[type], key);
      return val !== undefined ? val : fallback
    },
    has(type, key) {
      return !!this.get(type, key)
    },
    set(key, value) {
      settings['user'][key] = value;
      publish(key, value);
    },
    subscribe(key, callback) {
      subscribers[key] = subscribers[key] || [];
      subscribers[key].push(callback);
    },
    unsubscribe(key, callback) {
      if (callback) {
        const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback);
        index > -1 && subscribers[key].splice(index, 1);
      } else {
        if (key in subscribers) {
          subscribers[key] = [];
        }
      }
    },
    clearSubscribers() {
      for (const key of Object.getOwnPropertyNames(subscribers)) {
        delete subscribers[key];
      }
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const prepLog = (type, args) => {
    const colors = {
      Info: 'green',
      Debug: 'gray',
      Warn: 'orange',
      Error: 'red',
    };

    args = Array.from(args);
    return [
      '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
      'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
      args,
    ]
  };

  var Log = {
    info() {
      Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments));
    },
    debug() {
      Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments));
    },
    error() {
      Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments));
    },
    warn() {
      Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments));
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let sendMetric = (type, event, params) => {
    Log.info('Sending metric', type, event, params);
  };

  // available metric per category
  const metrics = {
    app: ['launch', 'loaded', 'ready', 'close'],
    page: ['view', 'leave'],
    user: ['click', 'input'],
    media: [
      'abort',
      'canplay',
      'ended',
      'pause',
      'play',
      // with some videos there occur almost constant suspend events ... should investigate
      // 'suspend',
      'volumechange',
      'waiting',
      'seeking',
      'seeked',
    ],
  };

  // error metric function (added to each category)
  const errorMetric = (type, message, code, visible, params = {}) => {
    params = { params, ...{ message, code, visible } };
    sendMetric(type, 'error', params);
  };

  const Metric = (type, events, options = {}) => {
    return events.reduce(
      (obj, event) => {
        obj[event] = (name, params = {}) => {
          params = { ...options, ...(name ? { name } : {}), ...params };
          sendMetric(type, event, params);
        };
        return obj
      },
      {
        error(message, code, params) {
          errorMetric(type, message, code, params);
        },
        event(name, params) {
          sendMetric(type, name, params);
        },
      }
    )
  };

  const Metrics = types => {
    return Object.keys(types).reduce(
      (obj, type) => {
        // media metric works a bit different!
        // it's a function that accepts a url and returns an object with the available metrics
        // url is automatically passed as a param in every metric
        type === 'media'
          ? (obj[type] = url => Metric(type, types[type], { url }))
          : (obj[type] = Metric(type, types[type]));
        return obj
      },
      { error: errorMetric, event: sendMetric }
    )
  };

  var Metrics$1 = Metrics(metrics);

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var events = {
    abort: 'Abort',
    canplay: 'CanPlay',
    canplaythrough: 'CanPlayThrough',
    durationchange: 'DurationChange',
    emptied: 'Emptied',
    encrypted: 'Encrypted',
    ended: 'Ended',
    error: 'Error',
    interruptbegin: 'InterruptBegin',
    interruptend: 'InterruptEnd',
    loadeddata: 'LoadedData',
    loadedmetadata: 'LoadedMetadata',
    loadstart: 'LoadStart',
    pause: 'Pause',
    play: 'Play',
    playing: 'Playing',
    progress: 'Progress',
    ratechange: 'Ratechange',
    seeked: 'Seeked',
    seeking: 'Seeking',
    stalled: 'Stalled',
    // suspend: 'Suspend', // this one is called a looooot for some videos
    timeupdate: 'TimeUpdate',
    volumechange: 'VolumeChange',
    waiting: 'Waiting',
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var autoSetupMixin = (sourceObject, setup = () => {}) => {
    let ready = false;

    const doSetup = () => {
      if (ready === false) {
        setup();
        ready = true;
      }
    };

    return Object.keys(sourceObject).reduce((obj, key) => {
      if (typeof sourceObject[key] === 'function') {
        obj[key] = function() {
          doSetup();
          return sourceObject[key].apply(sourceObject, arguments)
        };
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
        obj.__defineGetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject)
        });
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
        obj.__defineSetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(
            sourceObject,
            arguments
          )
        });
      } else {
        obj[key] = sourceObject[key];
      }
      return obj
    }, {})
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let timeout = null;

  var easeExecution = (cb, delay) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb();
    }, delay);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var Lightning = window.lng;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const events$1 = [
    'timeupdate',
    'error',
    'ended',
    'loadeddata',
    'canplay',
    'play',
    'playing',
    'pause',
    'loadstart',
    'seeking',
    'seeked',
    'encrypted',
  ];

  let mediaUrl = url => url;

  class Mediaplayer extends Lightning.Component {
    _construct() {
      this._skipRenderToTexture = false;
      this._metrics = null;
      this._textureMode = Settings.get('platform', 'textureMode') || false;
      Log.info('Texture mode: ' + this._textureMode);
      console.warn(
        [
          "The 'MediaPlayer'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.",
          "Please consider using the new 'VideoPlayer'-plugin instead.",
          'https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer',
        ].join('\n\n')
      );
    }

    static _template() {
      return {
        Video: {
          VideoWrap: {
            VideoTexture: {
              visible: false,
              pivot: 0.5,
              texture: { type: Lightning.textures.StaticTexture, options: {} },
            },
          },
        },
      }
    }

    set skipRenderToTexture(v) {
      this._skipRenderToTexture = v;
    }

    get textureMode() {
      return this._textureMode
    }

    get videoView() {
      return this.tag('Video')
    }

    _init() {
      //re-use videotag if already there
      const videoEls = document.getElementsByTagName('video');
      if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];
      else {
        this.videoEl = document.createElement('video');
        this.videoEl.setAttribute('id', 'video-player');
        this.videoEl.style.position = 'absolute';
        this.videoEl.style.zIndex = '1';
        this.videoEl.style.display = 'none';
        this.videoEl.setAttribute('width', '100%');
        this.videoEl.setAttribute('height', '100%');

        this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
        document.body.appendChild(this.videoEl);
      }
      if (this.textureMode && !this._skipRenderToTexture) {
        this._createVideoTexture();
      }

      this.eventHandlers = [];
    }

    _registerListeners() {
      events$1.forEach(event => {
        const handler = e => {
          if (this._metrics && this._metrics[event] && typeof this._metrics[event] === 'function') {
            this._metrics[event]({ currentTime: this.videoEl.currentTime });
          }
          this.fire(event, { videoElement: this.videoEl, event: e });
        };
        this.eventHandlers.push(handler);
        this.videoEl.addEventListener(event, handler);
      });
    }

    _deregisterListeners() {
      Log.info('Deregistering event listeners MediaPlayer');
      events$1.forEach((event, index) => {
        this.videoEl.removeEventListener(event, this.eventHandlers[index]);
      });
      this.eventHandlers = [];
    }

    _attach() {
      this._registerListeners();
    }

    _detach() {
      this._deregisterListeners();
      this.close();
    }

    _createVideoTexture() {
      const stage = this.stage;

      const gl = stage.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };
    }

    _startUpdatingVideoTexture() {
      if (this.textureMode && !this._skipRenderToTexture) {
        const stage = this.stage;
        if (!this._updateVideoTexture) {
          this._updateVideoTexture = () => {
            if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
              const gl = stage.gl;

              const currentTime = new Date().getTime();

              // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
              // We'll fallback to fixed 30fps in this case.
              const frameCount = this.videoEl.webkitDecodedFrameCount;

              const mustUpdate = frameCount
                ? this._lastFrame !== frameCount
                : this._lastTime < currentTime - 30;

              if (mustUpdate) {
                this._lastTime = currentTime;
                this._lastFrame = frameCount;
                try {
                  gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                  this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                  this.videoTextureView.visible = true;

                  this.videoTexture.options.w = this.videoEl.videoWidth;
                  this.videoTexture.options.h = this.videoEl.videoHeight;
                  const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
                  const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
                  if (expectedAspectRatio > realAspectRatio) {
                    this.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
                    this.videoTextureView.scaleY = 1;
                  } else {
                    this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
                    this.videoTextureView.scaleX = 1;
                  }
                } catch (e) {
                  Log.error('texImage2d video', e);
                  this._stopUpdatingVideoTexture();
                  this.videoTextureView.visible = false;
                }
                this.videoTexture.source.forceRenderUpdate();
              }
            }
          };
        }
        if (!this._updatingVideoTexture) {
          stage.on('frameStart', this._updateVideoTexture);
          this._updatingVideoTexture = true;
        }
      }
    }

    _stopUpdatingVideoTexture() {
      if (this.textureMode) {
        const stage = this.stage;
        stage.removeListener('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = false;
        this.videoTextureView.visible = false;

        if (this.videoTexture.options.source) {
          const gl = stage.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
    }

    updateSettings(settings = {}) {
      // The Component that 'consumes' the media player.
      this._consumer = settings.consumer;

      if (this._consumer && this._consumer.getMediaplayerSettings) {
        // Allow consumer to add settings.
        settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
      }

      if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
        if (settings.stream && settings.stream.keySystem) {
          navigator
            .requestMediaKeySystemAccess(
              settings.stream.keySystem.id,
              settings.stream.keySystem.config
            )
            .then(keySystemAccess => {
              return keySystemAccess.createMediaKeys()
            })
            .then(createdMediaKeys => {
              return this.videoEl.setMediaKeys(createdMediaKeys)
            })
            .then(() => {
              if (settings.stream && settings.stream.src) this.open(settings.stream.src);
            })
            .catch(() => {
              console.error('Failed to set up MediaKeys');
            });
        } else if (settings.stream && settings.stream.src) {
          // This is here to be backwards compatible, will be removed
          // in future sdk release
          if (Settings.get('app', 'hls')) {
            if (!window.Hls) {
              window.Hls = class Hls {
                static isSupported() {
                  console.warn('hls-light not included');
                  return false
                }
              };
            }
            if (window.Hls.isSupported()) {
              if (!this._hls) this._hls = new window.Hls({ liveDurationInfinity: true });
              this._hls.loadSource(settings.stream.src);
              this._hls.attachMedia(this.videoEl);
              this.videoEl.style.display = 'block';
            }
          } else {
            this.open(settings.stream.src);
          }
        } else {
          this.close();
        }
        this._stream = settings.stream;
      }

      this._setHide(settings.hide);
      this._setVideoArea(settings.videoPos);
    }

    _setHide(hide) {
      if (this.textureMode) {
        this.tag('Video').setSmooth('alpha', hide ? 0 : 1);
      } else {
        this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
      }
    }

    open(url, settings = { hide: false, videoPosition: null }) {
      // prep the media url to play depending on platform (mediaPlayerplugin)
      url = mediaUrl(url);
      this._metrics = Metrics$1.media(url);
      Log.info('Playing stream', url);
      if (this.application.noVideo) {
        Log.info('noVideo option set, so ignoring: ' + url);
        return
      }
      // close the video when opening same url as current (effectively reloading)
      if (this.videoEl.getAttribute('src') === url) {
        this.close();
      }
      this.videoEl.setAttribute('src', url);

      // force hide, then force show (in next tick!)
      // (fixes comcast playback rollover issue)
      this.videoEl.style.visibility = 'hidden';
      this.videoEl.style.display = 'none';

      setTimeout(() => {
        this.videoEl.style.display = 'block';
        this.videoEl.style.visibility = 'visible';
      });

      this._setHide(settings.hide);
      this._setVideoArea(settings.videoPosition || [0, 0, 1920, 1080]);
    }

    close() {
      // We need to pause first in order to stop sound.
      this.videoEl.pause();
      this.videoEl.removeAttribute('src');

      // force load to reset everything without errors
      this.videoEl.load();

      this._clearSrc();

      this.videoEl.style.display = 'none';
    }

    playPause() {
      if (this.isPlaying()) {
        this.doPause();
      } else {
        this.doPlay();
      }
    }

    get muted() {
      return this.videoEl.muted
    }

    set muted(v) {
      this.videoEl.muted = v;
    }

    get loop() {
      return this.videoEl.loop
    }

    set loop(v) {
      this.videoEl.loop = v;
    }

    isPlaying() {
      return this._getState() === 'Playing'
    }

    doPlay() {
      this.videoEl.play();
    }

    doPause() {
      this.videoEl.pause();
    }

    reload() {
      var url = this.videoEl.getAttribute('src');
      this.close();
      this.videoEl.src = url;
    }

    getPosition() {
      return Promise.resolve(this.videoEl.currentTime)
    }

    setPosition(pos) {
      this.videoEl.currentTime = pos;
    }

    getDuration() {
      return Promise.resolve(this.videoEl.duration)
    }

    seek(time, absolute = false) {
      if (absolute) {
        this.videoEl.currentTime = time;
      } else {
        this.videoEl.currentTime += time;
      }
    }

    get videoTextureView() {
      return this.tag('Video').tag('VideoTexture')
    }

    get videoTexture() {
      return this.videoTextureView.texture
    }

    _setVideoArea(videoPos) {
      if (Lightning.Utils.equalValues(this._videoPos, videoPos)) {
        return
      }

      this._videoPos = videoPos;

      if (this.textureMode) {
        this.videoTextureView.patch({
          smooth: {
            x: videoPos[0],
            y: videoPos[1],
            w: videoPos[2] - videoPos[0],
            h: videoPos[3] - videoPos[1],
          },
        });
      } else {
        const precision = this.stage.getRenderPrecision();
        this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
        this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
        this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
        this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
      }
    }

    _fireConsumer(event, args) {
      if (this._consumer) {
        this._consumer.fire(event, args);
      }
    }

    _equalInitData(buf1, buf2) {
      if (!buf1 || !buf2) return false
      if (buf1.byteLength != buf2.byteLength) return false
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);
      for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false
      return true
    }

    error(args) {
      this._fireConsumer('$mediaplayerError', args);
      this._setState('');
      return ''
    }

    loadeddata(args) {
      this._fireConsumer('$mediaplayerLoadedData', args);
    }

    play(args) {
      this._fireConsumer('$mediaplayerPlay', args);
    }

    playing(args) {
      this._fireConsumer('$mediaplayerPlaying', args);
      this._setState('Playing');
    }

    canplay(args) {
      this.videoEl.play();
      this._fireConsumer('$mediaplayerStart', args);
    }

    loadstart(args) {
      this._fireConsumer('$mediaplayerLoad', args);
    }

    seeked() {
      this._fireConsumer('$mediaplayerSeeked', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1,
      });
    }

    seeking() {
      this._fireConsumer('$mediaplayerSeeking', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1,
      });
    }

    durationchange(args) {
      this._fireConsumer('$mediaplayerDurationChange', args);
    }

    encrypted(args) {
      const video = args.videoElement;
      const event = args.event;
      // FIXME: Double encrypted events need to be properly filtered by Gstreamer
      if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
        this._previousInitData = event.initData;
        this._fireConsumer('$mediaplayerEncrypted', args);
      }
    }

    static _states() {
      return [
        class Playing extends this {
          $enter() {
            this._startUpdatingVideoTexture();
          }
          $exit() {
            this._stopUpdatingVideoTexture();
          }
          timeupdate() {
            this._fireConsumer('$mediaplayerProgress', {
              currentTime: this.videoEl.currentTime,
              duration: this.videoEl.duration || 1,
            });
          }
          ended(args) {
            this._fireConsumer('$mediaplayerEnded', args);
            this._setState('');
          }
          pause(args) {
            this._fireConsumer('$mediaplayerPause', args);
            this._setState('Playing.Paused');
          }
          _clearSrc() {
            this._fireConsumer('$mediaplayerStop', {});
            this._setState('');
          }
          static _states() {
            return [class Paused extends this {}]
          }
        },
      ]
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const isFunction = v => {
    return typeof v === 'function'
  };

  const isObject = v => {
    return typeof v === 'object' && v !== null
  };

  const isBoolean = v => {
    return typeof v === 'boolean'
  };

  const isPage = v => {
    if (v instanceof Lightning.Element || isComponentConstructor(v)) {
      return true
    }
    return false
  };

  const isComponentConstructor = type => {
    return type.prototype && 'isComponent' in type.prototype
  };

  const isArray = v => {
    return Array.isArray(v)
  };

  const ucfirst = v => {
    return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
  };

  const isString = v => {
    return typeof v === 'string'
  };

  const isPromise = method => {
    let result;
    if (isFunction(method)) {
      try {
        result = method.apply(null);
      } catch (e) {
        result = e;
      }
    } else {
      result = method;
    }
    return isObject(result) && isFunction(result.then)
  };

  const getConfigMap = () => {
    const routerSettings = Settings.get('platform', 'router');
    const isObj = isObject(routerSettings);
    return [
      'backtrack',
      'gcOnUnload',
      'destroyOnHistoryBack',
      'lazyCreate',
      'lazyDestroy',
      'reuseInstance',
      'autoRestoreRemote',
      'numberNavigation',
      'updateHash',
    ].reduce((config, key) => {
      config.set(key, isObj ? routerSettings[key] : Settings.get('platform', key));
      return config
    }, new Map())
  };

  const getQueryStringParams = hash => {
    const getQuery = /([?&].*)/;
    const matches = getQuery.exec(hash);
    const params = {};

    if (matches && matches.length) {
      const urlParams = new URLSearchParams(matches[1]);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
      return params
    }
    return false
  };

  const objectToQueryString = obj => {
    if (!isObject(obj)) {
      return ''
    }
    return (
      '?' +
      Object.keys(obj)
        .map(key => {
          return `${key}=${obj[key]}`
        })
        .join('&')
    )
  };

  const symbols = {
    route: Symbol('route'),
    hash: Symbol('hash'),
    store: Symbol('store'),
    fromHistory: Symbol('fromHistory'),
    expires: Symbol('expires'),
    resume: Symbol('resume'),
    backtrack: Symbol('backtrack'),
    historyState: Symbol('historyState'),
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;
  const isWildcard = /^[!*$]$/;
  const hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
  const isNamedGroup = /^\/:/;

  /**
   * Test if a route is part regular expressed
   * and replace it for a simple character
   * @param route
   * @returns {*}
   */
  const stripRegex = (route, char = 'R') => {
    // if route is part regular expressed we replace
    // the regular expression for a character to
    // simplify floor calculation and backtracking
    if (hasRegex.test(route)) {
      route = route.replace(hasRegex, char);
    }
    return route
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Create a local request register
   * @param flags
   * @returns {Map<any, any>}
   */
  const createRegister = flags => {
    const reg = new Map()
    // store user defined and router
    // defined flags in register
    ;[...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach(key => {
      reg.set(key, flags[key]);
    });
    return reg
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class Request {
    constructor(hash, navArgs, storeCaller = true) {
      this._hash = hash;
      this._storeCaller = storeCaller;
      this._register = new Map();
      this._isCreated = false;
      this._isSharedInstance = false;
      this._cancelled = false;

      // if there are arguments attached to navigate()
      // we store them in new request
      if (isObject(navArgs)) {
        this._register = createRegister(navArgs);
      } else if (isBoolean(navArgs) && !navArgs) {
        // if second navigate() argument is explicitly
        // set to false we prevent the calling page
        // from ending up in history
        this._storeCaller = false;
      }
      // @todo: remove because we can simply check
      // ._storeCaller property
      this._register.set(symbols.store, this._storeCaller);
    }

    cancel() {
      console.log('cancelled:', this._hash);
      this._cancelled = true;
    }

    get url() {
      return this._hash
    }

    get register() {
      return this._register
    }

    get hash() {
      return this._hash
    }

    set hash(args) {
      this._hash = args;
    }

    get route() {
      return this._route
    }

    set route(args) {
      this._route = args;
    }

    get provider() {
      return this._provider
    }

    set provider(args) {
      this._provider = args;
    }

    get providerType() {
      return this._providerType
    }

    set providerType(args) {
      this._providerType = args;
    }

    set page(args) {
      this._page = args;
    }

    get page() {
      return this._page
    }

    set isCreated(args) {
      this._isCreated = args;
    }

    get isCreated() {
      return this._isCreated
    }

    get isSharedInstance() {
      return this._isSharedInstance
    }

    set isSharedInstance(args) {
      this._isSharedInstance = args;
    }

    get isCancelled() {
      return this._cancelled
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class Route {
    constructor(config = {}) {
      // keep backwards compatible
      let type = ['on', 'before', 'after'].reduce((acc, type) => {
        return isFunction(config[type]) ? type : acc
      }, undefined);

      this._cfg = config;
      if (type) {
        this._provider = {
          type,
          request: config[type],
        };
      }
    }

    get path() {
      return this._cfg.path
    }

    get component() {
      return this._cfg.component
    }

    get options() {
      return this._cfg.options
    }

    get widgets() {
      return this._cfg.widgets
    }

    get cache() {
      return this._cfg.cache
    }

    get hook() {
      return this._cfg.hook
    }

    get beforeNavigate() {
      return this._cfg.beforeNavigate
    }

    get provider() {
      return this._provider
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Simple route length calculation
   * @param route {string}
   * @returns {number} - floor
   */
  const getFloor = route => {
    return stripRegex(route).split('/').length
  };

  /**
   * return all stored routes that live on the same floor
   * @param floor
   * @returns {Array}
   */
  const getRoutesByFloor = floor => {
    const matches = [];
    // simple filter of level candidates
    for (let [route] of routes.entries()) {
      if (getFloor(route) === floor) {
        matches.push(route);
      }
    }
    return matches
  };

  /**
   * return a matching route by provided hash
   * hash: home/browse/12 will match:
   * route: home/browse/:categoryId
   * @param hash {string}
   * @returns {boolean|{}} - route
   */
  const getRouteByHash = hash => {
    // @todo: clean up on handleHash
    hash = hash.replace(/^#/, '');

    const getUrlParts = /(\/?:?[@!*\w%\s:-]+)/g;
    // grab possible candidates from stored routes
    const candidates = getRoutesByFloor(getFloor(hash));
    // break hash down in chunks
    const hashParts = hash.match(getUrlParts) || [];

    // to simplify the route matching and prevent look around
    // in our getUrlParts regex we get the regex part from
    // route candidate and store them so that we can reference
    // them when we perform the actual regex against hash
    let regexStore = [];

    let matches = candidates.filter(route => {
      let isMatching = true;
      // replace regex in route with lookup id => @@{storeId}@@
      if (hasRegex.test(route)) {
        const regMatches = route.match(hasRegex);
        if (regMatches && regMatches.length) {
          route = regMatches.reduce((fullRoute, regex) => {
            const lookupId = regexStore.length;
            fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`);
            regexStore.push(regex.substring(1, regex.length - 1));
            return fullRoute
          }, route);
        }
      }

      const routeParts = route.match(getUrlParts) || [];

      for (let i = 0, j = routeParts.length; i < j; i++) {
        const routePart = routeParts[i];
        const hashPart = hashParts[i];

        // Since we support catch-all and regex driven name groups
        // we first test for regex lookup id and see if the regex
        // matches the value from the hash
        if (hasLookupId.test(routePart)) {
          const routeMatches = hasLookupId.exec(routePart);
          const storeId = routeMatches[1];
          const routeRegex = regexStore[storeId];

          // split regex and modifiers so we can use both
          // to create a new RegExp
          // eslint-disable-next-line
                  const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex);

          if (regMatches && regMatches.length) {
            const expression = regMatches[1];
            const modifiers = regMatches[2];

            const regex = new RegExp(`^/${expression}$`, modifiers);

            if (!regex.test(hashPart)) {
              isMatching = false;
            }
          }
        } else if (isNamedGroup.test(routePart)) {
          // we kindly skip namedGroups because this is dynamic
          // we only need to the static and regex drive parts
          continue
        } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
          isMatching = false;
        }
      }
      return isMatching
    });

    if (matches.length) {
      if (matches.indexOf(hash) !== -1) {
        const match = matches[matches.indexOf(hash)];
        return routes.get(match)
      } else {
        // we give prio to static routes over dynamic
        matches = matches.sort(a => {
          return isNamedGroup.test(a) ? -1 : 1
        });
        // would be strange if this fails
        // but still we test
        if (routeExists(matches[0])) {
          return routes.get(matches[0])
        }
      }
    }
    return false
  };

  const getValuesFromHash = (hash = '', path) => {
    // replace the regex definition from the route because
    // we already did the matching part
    path = stripRegex(path, '');

    const getUrlParts = /(\/?:?[\w%\s:-]+)/g;
    const hashParts = hash.match(getUrlParts) || [];
    const routeParts = path.match(getUrlParts) || [];
    const getNamedGroup = /^\/:([\w-]+)\/?/;

    return routeParts.reduce((storage, value, index) => {
      const match = getNamedGroup.exec(value);
      if (match && match.length) {
        storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')));
      }
      return storage
    }, new Map())
  };

  const getOption = (stack, prop) => {
    // eslint-disable-next-line
      if(stack && stack.hasOwnProperty(prop)){
      return stack[prop]
    }
    // we explicitly return undefined since we're testing
    // for explicit test values
  };

  /**
   * create and return new Route instance
   * @param config
   */
  const createRoute = config => {
    return new Route(config)
  };
  /**
   * Create a new Router request object
   * @param url
   * @param args
   * @param store
   * @returns {*}
   */
  const createRequest = (url, args, store) => {
    return new Request(url, args, store)
  };

  const getHashByName = obj => {
    if (!obj.name) {
      return false
    }
    const route = getRouteByName(obj.name);
    const hasDynamicGroup = /\/:([\w-]+)\/?/;
    let hash = route;

    // if route contains dynamic group
    // we replace them with the provided params
    if (hasDynamicGroup.test(route)) {
      if (obj.params) {
        const keys = Object.keys(obj.params);
        hash = keys.reduce((acc, key) => {
          return acc.replace(`:${key}`, obj.params[key])
        }, route);
      }
      if (obj.query) {
        return `${hash}${objectToQueryString(obj.query)}`
      }
    }
    return hash
  };

  const getRouteByName = name => {
    for (let [path, route] of routes.entries()) {
      if (route.name === name) {
        return path
      }
    }
    return false
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var emit = (page, events = [], params = {}) => {
    if (!isArray(events)) {
      events = [events];
    }
    events.forEach(e => {
      const event = `_on${ucfirst(e)}`;
      if (isFunction(page[event])) {
        page[event](params);
      }
    });
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let activeWidget = null;

  const getReferences = () => {
    if (!widgetsHost) {
      return
    }
    return widgetsHost.get().reduce((storage, widget) => {
      const key = widget.ref.toLowerCase();
      storage[key] = widget;
      return storage
    }, {})
  };

  /**
   * update the visibility of the available widgets
   * for the current page / route
   * @param page
   */
  const updateWidgets = (widgets, page) => {
    // force lowercase lookup
    const configured = (widgets || []).map(ref => ref.toLowerCase());

    widgetsHost.forEach(widget => {
      widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1;
      if (widget.visible) {
        emit(widget, ['activated'], page);
      }
    });
    if (app.state === 'Widgets' && activeWidget && !activeWidget.visible) {
      app._setState('');
    }
  };

  const getWidgetByName = name => {
    name = ucfirst(name);
    return widgetsHost.getByRef(name) || false
  };

  /**
   * delegate app focus to a on-screen widget
   * @param name - {string}
   */
  const focusWidget = name => {
    const widget = getWidgetByName(name);
    if (widget) {
      setActiveWidget(widget);

      // if app is already in 'Widgets' state we can assume that
      // focus has been delegated from one widget to another so
      // we need to set the new widget reference and trigger a
      // new focus calculation of Lightning's focuspath
      if (app.state === 'Widgets') {
        app.reload(activeWidget);
      } else {
        app._setState('Widgets', [activeWidget]);
      }
    }
  };

  const restoreFocus = () => {
    activeWidget = null;
    app._setState('');
  };

  const getActiveWidget = () => {
    return activeWidget
  };

  const setActiveWidget = instance => {
    activeWidget = instance;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const createComponent = (stage, type) => {
    return stage.c({
      type,
      visible: false,
      widgets: getReferences(),
    })
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Simple flat array that holds the visited hashes + state Object
   * so the router can navigate back to them
   * @type {Array}
   */
  let history = [];

  const updateHistory = request => {
    const hash = getActiveHash();

    if (!hash) {
      return
    }

    const route = request.route;
    const register = request.register;
    const storeHash = getOption(route.options, 'store');
    const regStore = register.get(symbols.store);
    const routerConfig = getRouterConfig();

    let configPrevent = getOption(route.options, 'preventStorage');
    let configStore = true;

    if ((isBoolean(storeHash) && storeHash === false) || configPrevent) {
      configStore = false;
    }

    if (regStore && configStore) {
      const toStore = hash.replace(/^\//, '');
      const location = locationInHistory(toStore);
      const stateObject = getStateObject(getActivePage());

      // store hash if it's not a part of history or flag for
      // storage of same hash is true
      if (location === -1 || routerConfig.get('storeSameHash')) {
        history.push({ hash: toStore, state: stateObject });
      } else {
        // if we visit the same route we want to sync history
        const prev = history.splice(location, 1)[0];
        history.push({ hash: prev.hash, state: stateObject });
      }
    }
  };

  const locationInHistory = hash => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].hash === hash) {
        return i
      }
    }
    return -1
  };

  const getHistoryState = hash => {
    let state = null;
    if (history.length) {
      // if no hash is provided we get the last
      // pushed history record
      if (!hash) {
        const record = history[history.length - 1];
        // could be null
        state = record.state;
      } else {
        if (locationInHistory(hash) !== -1) {
          const record = history[locationInHistory(hash)];
          state = record.state;
        }
      }
    }
    return state
  };

  const replaceHistoryState = (state = null, hash) => {
    if (!history.length) {
      return
    }
    const location = hash ? locationInHistory(hash) : history.length - 1;
    if (location !== -1 && isObject(state)) {
      history[location].state = state;
    }
  };

  const getStateObject = page => {
    if (page && isFunction(page.historyState)) {
      return page.historyState()
    }
    return null
  };

  const getHistory = () => {
    return history.slice(0)
  };

  const setHistory = (arr = []) => {
    if (isArray(arr)) {
      history = arr;
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class VersionLabel extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        color: 0xbb0078ac,
        h: 40,
        w: 100,
        x: w => w - 50,
        y: h => h - 50,
        mount: 1,
        Text: {
          w: w => w,
          h: h => h,
          y: 5,
          x: 20,
          text: {
            fontSize: 22,
            lineHeight: 26,
          },
        },
      }
    }

    _firstActive() {
      this.tag('Text').text = `APP - v${this.version}\nSDK - v${this.sdkVersion}`;
      this.tag('Text').loadTexture();
      this.w = this.tag('Text').renderWidth + 40;
      this.h = this.tag('Text').renderHeight + 5;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FpsIndicator extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        color: 0xffffffff,
        texture: Lightning.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: Lightning.Tools.getRoundRect(72, 72, 36),
          color: 0xff008000,
        },
        Counter: {
          w: w => w,
          h: h => h,
          y: 10,
          text: {
            fontSize: 32,
            textAlign: 'center',
          },
        },
        Text: {
          w: w => w,
          h: h => h,
          y: 48,
          text: {
            fontSize: 15,
            textAlign: 'center',
            text: 'FPS',
          },
        },
      }
    }

    _setup() {
      this.config = {
        ...{
          log: false,
          interval: 500,
          threshold: 1,
        },
        ...Settings.get('platform', 'showFps'),
      };

      this.fps = 0;
      this.lastFps = this.fps - this.config.threshold;

      const fpsCalculator = () => {
        this.fps = ~~(1 / this.stage.dt);
      };
      this.stage.on('frameStart', fpsCalculator);
      this.stage.off('framestart', fpsCalculator);
      this.interval = setInterval(this.showFps.bind(this), this.config.interval);
    }

    _firstActive() {
      this.showFps();
    }

    _detach() {
      clearInterval(this.interval);
    }

    showFps() {
      if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return
      this.lastFps = this.fps;
      // green
      let bgColor = 0xff008000;
      // orange
      if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500;
      // red
      else if (this.fps <= 20) bgColor = 0xffff0000;

      this.tag('Background').setSmooth('color', bgColor);
      this.tag('Counter').text = `${this.fps}`;

      this.config.log && Log.info('FPS', this.fps);
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let AppInstance;

  const defaultOptions = {
    stage: { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false },
    debug: false,
    defaultFontFace: 'RobotoRegular',
    keys: {
      8: 'Back',
      13: 'Enter',
      27: 'Menu',
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
      174: 'ChannelDown',
      175: 'ChannelUp',
      178: 'Stop',
      250: 'PlayPause',
      191: 'Search', // Use "/" for keyboard
      409: 'Search',
    },
  };

  if (window.innerHeight === 720) {
    defaultOptions.stage['w'] = 1280;
    defaultOptions.stage['h'] = 720;
    defaultOptions.stage['precision'] = 0.6666666667;
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * @type {Lightning.Application}
   */
  let application;

  /**
   * Actual instance of the app
   * @type {Lightning.Component}
   */
  let app;

  /**
   * Component that hosts all routed pages
   * @type {Lightning.Component}
   */
  let pagesHost;

  /**
   * @type {Lightning.Stage}
   */
  let stage;

  /**
   * Platform driven Router configuration
   * @type {Map<string>}
   */
  let routerConfig;

  /**
   * Component that hosts all attached widgets
   * @type {Lightning.Component}
   */
  let widgetsHost;

  /**
   * Hash we point the browser to when we boot the app
   * and there is no deep-link provided
   * @type {string|Function}
   */
  let rootHash;

  /**
   * Boot request will fire before app start
   * can be used to execute some global logic
   * and can be configured
   */
  let bootRequest;

  /**
   * Flag if we need to update the browser location hash.
   * Router can work without.
   * @type {boolean}
   */
  let updateHash = true;

  /**
   * Will be called before a route starts, can be overridden
   * via routes config
   * @param from - route we came from
   * @param to - route we navigate to
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line
  let beforeEachRoute = async (from, to)=>{
    return true
  };

  /**
   * All configured routes
   * @type {Map<string, object>}
   */
  let routes = new Map();

  /**
   * Store all page components per route
   * @type {Map<string, object>}
   */
  let components = new Map();

  /**
   * Flag if router has been initialised
   * @type {boolean}
   */
  let initialised = false;

  /**
   * Current page being rendered on screen
   * @type {null}
   */

  let activeHash;
  let activePage = null;
  let activeRoute;

  /**
   *  During the process of a navigation request a new
   *  request can start, to prevent unwanted behaviour
   *  the navigate()-method stores the last accepted hash
   *  so we can invalidate any prior requests
   */
  let lastAcceptedHash;

  /**
   * With on()-data providing behaviour the Router forced the App
   * in a Loading state. When the data-provider resolves we want to
   * change the state back to where we came from
   */
  let previousState;

  const mixin = app => {
    // by default the Router Baseclass provides the component
    // reference in which we store our pages
    if (app.pages) {
      pagesHost = app.pages.childList;
    }
    // if the app is using widgets we grab refs
    // and hide all the widgets
    if (app.widgets && app.widgets.children) {
      widgetsHost = app.widgets.childList;
      // hide all widgets on boot
      widgetsHost.forEach(w => (w.visible = false));
    }
    app._handleBack = e => {
      step(-1);
      e.preventDefault();
    };
    app._captureKey = capture.bind(null);
  };

  const bootRouter = (config, instance) => {
    let { appInstance, routes } = config;

    // if instance is provided and it's and Lightning Component instance
    if (instance && isPage(instance)) {
      app = instance;
    }
    if (!app) {
      app = appInstance || AppInstance;
    }

    application = app.application;
    pagesHost = application.childList;
    stage = app.stage;
    routerConfig = getConfigMap();

    mixin(app);

    if (isArray(routes)) {
      setup(config);
    } else if (isFunction(routes)) {
      console.warn('[Router]: Calling Router.route() directly is deprecated.');
      console.warn(
        'Use object config: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration'
      );
    }
  };

  const setup = config => {
    if (!initialised) {
      init(config);
    }
    config.routes.forEach(r => {
      // strip leading slash
      const path = r.path.replace(/\/+$/, '');
      if (!routeExists(path)) {
        const route = createRoute(r);
        routes.set(path, route);
        // if route has a configured component property
        // we store it in a different map to simplify
        // the creating and destroying per route
        if (route.component) {
          let type = route.component;
          if (isComponentConstructor(type)) {
            if (!routerConfig.get('lazyCreate')) {
              type = createComponent(stage, type);
              pagesHost.a(type);
            }
          }
          components.set(path, type);
        }
      } else {
        console.error(`${path} already exists in routes configuration`);
      }
    });
  };

  const init = config => {
    rootHash = config.root;
    if (isFunction(config.boot)) {
      bootRequest = config.boot;
    }
    if (isBoolean(config.updateHash)) {
      updateHash = config.updateHash;
    }
    if (isFunction(config.beforeEachRoute)) {
      beforeEachRoute = config.beforeEachRoute;
    }
    if (config.bootComponent) {
      if (isPage(config.bootComponent)) {
        config.routes.push({
          path: '@router-boot-page',
          component: config.bootComponent,
        });
      } else {
        console.error(`[Router]: ${config.bootComponent} is not a valid boot component`);
      }
    }
    initialised = true;
  };

  const storeComponent = (route, type) => {
    if (components.has(route)) {
      components.set(route, type);
    }
  };

  const getComponent = route => {
    if (components.has(route)) {
      return components.get(route)
    }
    return null
  };
  /**
   * Test if router needs to update browser location hash
   * @returns {boolean}
   */
  const mustUpdateLocationHash = () => {
    // we need support to either turn change hash off
    // per platform or per app
    const updateConfig = routerConfig.get('updateHash');
    return !((isBoolean(updateConfig) && !updateConfig) || (isBoolean(updateHash) && !updateHash))
  };

  /**
   * Will be called when a new navigate() request has completed
   * and has not been expired due to it's async nature
   * @param request
   */
  const onRequestResolved = request => {
    const hash = request.hash;
    const route = request.route;
    const register = request.register;
    const page = request.page;

    // clean up history if modifier is set
    if (getOption(route.options, 'clearHistory')) {
      setHistory([]);
    } else if (hash && !isWildcard.test(route.path)) {
      updateHistory(request);
    }

    // we only update the stackLocation if a route
    // is not expired before it resolves
    storeComponent(route.path, page);

    if (request.isSharedInstance || !request.isCreated) {
      emit(page, 'changed');
    } else if (request.isCreated) {
      emit(page, 'mounted');
    }

    // only update widgets if we have a host
    if (widgetsHost) {
      updateWidgets(route.widgets, page);
    }

    // we want to clean up if there is an
    // active page that is not being shared
    // between current and previous route
    if (getActivePage() && !request.isSharedInstance) {
      cleanUp(activePage, request);
    }

    if (register.get(symbols.historyState) && isFunction(page.historyState)) {
      page.historyState(register.get(symbols.historyState));
    }

    setActivePage(page);

    activeHash = request.hash;
    activeRoute = route.path;

    Log.info('[route]:', route.path);
    Log.info('[hash]:', hash);
  };

  const cleanUp = (page, request) => {
    const route = activeRoute;
    const register = request.register;
    const lazyDestroy = routerConfig.get('lazyDestroy');
    const destroyOnBack = routerConfig.get('destroyOnHistoryBack');
    const keepAlive = register.get('keepAlive');
    const isFromHistory = register.get(symbols.backtrack);

    let doCleanup = false;

    if (isFromHistory && (destroyOnBack || lazyDestroy)) {
      doCleanup = true;
    } else if (lazyDestroy && !keepAlive) {
      doCleanup = true;
    }

    if (doCleanup) {
      // grab original class constructor if
      // statemachine routed else store constructor
      storeComponent(route, page._routedType || page.constructor);

      // actual remove of page from memory
      pagesHost.remove(page);

      // force texture gc() if configured
      // so we can cleanup textures in the same tick
      if (routerConfig.get('gcOnUnload')) {
        stage.gc();
      }
    } else {
      // If we're not removing the page we need to
      // reset it's properties
      page.patch({
        x: 0,
        y: 0,
        scale: 1,
        alpha: 1,
        visible: false,
      });
    }
  };

  /**
   * Capture each keypress so we can quick-nav
   * to defined routes
   * @param key
   * @returns {boolean}
   */
  const capture = ({ key }) => {
    // in Loading state we want to stop propagation
    // by returning true explicitly
    if (app.state === 'Loading') {
      return true
    }
    // if not set we want to continue propagation
    // by explicitly returning false
    if (!routerConfig.get('numberNavigation')) {
      return false
    }
    key = parseInt(key);
    if (!isNaN(key)) {
      let match;
      let idx = 1;
      for (let route of routes.keys()) {
        if (idx === key) {
          match = route;
          break
        } else {
          idx++;
        }
      }
      if (match) {
        navigate(match);
      }
    }
    return false
  };

  const getActiveHash = () => {
    return activeHash
  };

  const setActivePage = page => {
    activePage = page;
  };

  const getActivePage = () => {
    return activePage
  };

  const getActiveRoute = () => {
    return activeRoute
  };

  const getLastHash = () => {
    return lastAcceptedHash
  };

  const setLastHash = hash => {
    lastAcceptedHash = hash;
  };

  const getPreviousState = () => {
    return previousState
  };

  const routeExists = key => {
    return routes.has(key)
  };

  const getRootHash = () => {
    return rootHash
  };

  const getBootRequest = () => {
    return bootRequest
  };

  const getRouterConfig = () => {
    return routerConfig
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const types = {
    on: request => {
      app.state || '';
      app._setState('Loading');
      return execProvider(request)
    },
    before: request => {
      return execProvider(request)
    },
    after: request => {
      try {
        execProvider(request);
      } catch (e) {
        // for now we fail silently
      }
      return Promise.resolve()
    },
    // on route share instance
    shared: request => {
      return execProvider(request)
    },
  };

  const execProvider = request => {
    const route = request.route;
    const provider = route.provider;
    const expires = 0;
    const params = addPersistData(request);
    return provider.request(request.page, { ...params }).then(() => {
      request.page[symbols.expires] = Date.now() + expires;
    })
  };

  const addPersistData = ({ page, route, hash, register = new Map() }) => {
    const urlValues = getValuesFromHash(hash, route.path);
    const pageData = new Map([...urlValues, ...register]);
    const params = {};

    // make dynamic url data available to the page
    // as instance properties
    for (let [name, value] of pageData) {
      // @todo: show page prop deprecation in changelog
      // page[name] = value;
      params[name] = value;
    }

    // check navigation register for persistent data
    if (register.size) {
      const obj = {};
      for (let [k, v] of register) {
        obj[k] = v;
      }
      page.persist = obj;
    }

    // make url data and persist data available
    // via params property
    page.params = params;
    emit(page, ['urlParams'], params);

    return params
  };

  /**
   * Test if page passed cache-time
   * @param page
   * @returns {boolean}
   */
  const isPageExpired = page => {
    if (!page[symbols.expires]) {
      return false
    }

    const expires = page[symbols.expires];
    const now = Date.now();

    return now >= expires
  };

  const hasProvider = path => {
    if (routeExists(path)) {
      const record = routes.get(path);
      return !!record.provider
    }
    return false
  };

  const getProvider = route => {
    // @todo: fix, route already is passed in
    if (routeExists(route.path)) {
      const { provider } = routes.get(route.path);
      return {
        type: provider.type,
        provider: provider.request,
      }
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const fade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, { duration: 0.5, delay: 0.1 }],
        },
      });
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        if (o) {
          o.visible = false;
        }
        resolve();
      });
    })
  };

  const crossFade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, { duration: 0.5, delay: 0.1 }],
        },
      });
      if (o) {
        o.patch({
          smooth: {
            alpha: [0, { duration: 0.5, delay: 0.3 }],
          },
        });
      }
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        resolve();
      });
    })
  };

  const moveOnAxes = (axis, direction, i, o) => {
    const bounds = axis === 'x' ? 1920 : 1080;
    return new Promise(resolve => {
      i.patch({
        [`${axis}`]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          [`${axis}`]: [0, { duration: 0.4, delay: 0.2 }],
        },
      });
      // out is optional
      if (o) {
        o.patch({
          [`${axis}`]: 0,
          smooth: {
            [`${axis}`]: [direction ? bounds : bounds * -1, { duration: 0.4, delay: 0.2 }],
          },
        });
      }
      // resolve on y finish
      i.transition(axis).on('finish', () => {
        resolve();
      });
    })
  };

  const up = (i, o) => {
    return moveOnAxes('y', 0, i, o)
  };

  const down = (i, o) => {
    return moveOnAxes('y', 1, i, o)
  };

  const left = (i, o) => {
    return moveOnAxes('x', 0, i, o)
  };

  const right = (i, o) => {
    return moveOnAxes('x', 1, i, o)
  };

  var Transitions = {
    fade,
    crossFade,
    up,
    down,
    left,
    right,
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * execute transition between new / old page and
   * toggle the defined widgets
   * @todo: platform override default transition
   * @param pageIn
   * @param pageOut
   */
  const executeTransition = (pageIn, pageOut = null) => {
    const transition = pageIn.pageTransition || pageIn.easing;
    const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
    const transitionsDisabled = getRouterConfig().get('disableTransitions');

    if (pageIn.easing) {
      console.warn('easing() method is deprecated and will be removed. Use pageTransition()');
    }

    // default behaviour is a visibility toggle
    if (!hasCustomTransitions || transitionsDisabled) {
      pageIn.visible = true;
      if (pageOut) {
        pageOut.visible = false;
      }
      return Promise.resolve()
    }

    if (transition) {
      let type;
      try {
        type = transition.call(pageIn, pageIn, pageOut);
      } catch (e) {
        type = 'crossFade';
      }

      if (isPromise(type)) {
        return type
      }

      if (isString(type)) {
        const fn = Transitions[type];
        if (fn) {
          return fn(pageIn, pageOut)
        }
      }

      // keep backwards compatible for now
      if (pageIn.smoothIn) {
        // provide a smooth function that resolves itself
        // on transition finish
        const smooth = (p, v, args = {}) => {
          return new Promise(resolve => {
            pageIn.visible = true;
            pageIn.setSmooth(p, v, args);
            pageIn.transition(p).on('finish', () => {
              resolve();
            });
          })
        };
        return pageIn.smoothIn({ pageIn, smooth })
      }
    }
    return Transitions.crossFade(pageIn, pageOut)
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * The actual loading of the component
   * */
  const load = async request => {
    let expired = false;
    try {
      request = await loader(request);
      if (request && !request.isCancelled) {
        // in case of on() providing we need to reset
        // app state;
        if (app.state === 'Loading') {
          if (getPreviousState() === 'Widgets') ; else {
            app._setState('');
          }
        }
        // Do page transition if instance
        // is not shared between the routes
        if (!request.isSharedInstance && !request.isCancelled) {
          await executeTransition(request.page, getActivePage());
        }
      } else {
        expired = true;
      }
      // on expired we only cleanup
      if (expired || request.isCancelled) {
        Log.debug('[router]:', `Rejected ${request.hash} because route to ${getLastHash()} started`);
        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }
      } else {
        onRequestResolved(request);
        // resolve promise
        return request.page
      }
    } catch (request) {
      if (!expired) {
        // @todo: revisit
        const { route } = request;
        // clean up history if modifier is set
        if (getOption(route.options, 'clearHistory')) {
          setHistory([]);
        } else if (!isWildcard.test(route.path)) {
          updateHistory(request);
        }

        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }
        handleError(request);
      }
    }
  };

  const loader = async request => {
    const route = request.route;
    const hash = request.hash;
    const register = request.register;

    // todo: grab from Route instance
    let type = getComponent(route.path);
    let isConstruct = isComponentConstructor(type);
    let provide = false;

    // if it's an instance bt we're not coming back from
    // history we test if we can re-use this instance
    if (!isConstruct && !register.get(symbols.backtrack)) {
      if (!mustReuse(route)) {
        type = type.constructor;
        isConstruct = true;
      }
    }

    // If type is not a constructor
    if (!isConstruct) {
      request.page = type;
      // if we have have a data route for current page
      if (hasProvider(route.path)) {
        if (isPageExpired(type) || type[symbols.hash] !== hash) {
          provide = true;
        }
      }
      let currentRoute = getActivePage() && getActivePage()[symbols.route];
      // if the new route is equal to the current route it means that both
      // route share the Component instance and stack location / since this case
      // is conflicting with the way before() and after() loading works we flag it,
      // and check platform settings in we want to re-use instance
      if (route.path === currentRoute) {
        request.isSharedInstance = true;
      }
    } else {
      request.page = createComponent(stage, type);
      pagesHost.a(request.page);
      // test if need to request data provider
      if (hasProvider(route.path)) {
        provide = true;
      }
      request.isCreated = true;
    }

    // we store hash and route as properties on the page instance
    // that way we can easily calculate new behaviour on page reload
    request.page[symbols.hash] = hash;
    request.page[symbols.route] = route.path;

    try {
      if (provide) {
        // extract attached data-provider for route
        // we're processing
        const { type: loadType, provider } = getProvider(route);

        // update running request
        request.provider = provider;
        request.providerType = loadType;

        await types[request.isSharedInstance ? 'shared' : loadType](request);

        // we early exit if the current request is expired
        if (hash !== getLastHash()) {
          return false
        } else {
          emit(request.page, 'dataProvided');
          // resolve promise
          return request
        }
      } else {
        addPersistData(request);
        return request
      }
    } catch (e) {
      request.error = e;
      return Promise.reject(request)
    }
  };

  const handleError = request => {
    if (request && request.error) {
      console.error(request.error);
    } else if (request) {
      Log.error(request);
    }

    if (request.page) {
      navigate('!', { request }, false);
    }
  };

  const mustReuse = route => {
    const opt = getOption(route.options, 'reuseInstance');
    const config = routerConfig.get('reuseInstance');

    // route always has final decision
    if (isBoolean(opt)) {
      return opt
    }
    return !(isBoolean(config) && config === false)
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class RoutedApp extends Lightning.Component {
    static _template() {
      return {
        Pages: {
          forceZIndexContext: true,
        },
        /**
         * This is a default Loading page that will be made visible
         * during data-provider on() you CAN override in child-class
         */
        Loading: {
          rect: true,
          w: 1920,
          h: 1080,
          color: 0xff000000,
          visible: false,
          zIndex: 99,
          Label: {
            mount: 0.5,
            x: 960,
            y: 540,
            text: {
              text: 'Loading..',
            },
          },
        },
      }
    }

    static _states() {
      return [
        class Loading extends this {
          $enter() {
            this.tag('Loading').visible = true;
          }

          $exit() {
            this.tag('Loading').visible = false;
          }
        },
        class Widgets extends this {
          $enter(args, widget) {
            // store widget reference
            this._widget = widget;

            // since it's possible that this behaviour
            // is non-remote driven we force a recalculation
            // of the focuspath
            this._refocus();
          }

          _getFocused() {
            // we delegate focus to selected widget
            // so it can consume remotecontrol presses
            return this._widget
          }

          // if we want to widget to widget focus delegation
          reload(widget) {
            this._widget = widget;
            this._refocus();
          }

          _handleKey() {
            Router.focusPage();
          }
        },
      ]
    }

    /**
     * Return location where pages need to be stored
     */
    get pages() {
      return this.tag('Pages')
    }

    /**
     * Tell router where widgets are stored
     */
    get widgets() {
      return this.tag('Widgets')
    }

    /**
     * we MUST register _handleBack method so the Router
     * can override it
     * @private
     */
    _handleBack() {}

    /**
     * we MUST register _captureKey for dev quick-navigation
     * (via keyboard 1-9)
     */
    _captureKey() {}

    /**
     * We MUST return Router.activePage() so the new Page
     * can listen to the remote-control.
     */
    _getFocused() {
      return Router.getActivePage()
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /*
  rouThor ==[x]
   */
  let navigateQueue = new Map();
  let forcedHash = '';
  let resumeHash = '';

  /**
   * Start routing the app
   * @param config - route config object
   * @param instance - instance of the app
   */
  const startRouter = (config, instance) => {
    bootRouter(config, instance);
    start();
  };

  // start translating url
  const start = () => {
    const bootKey = '@router-boot-page';
    const hash = (getHash() || '').replace(/^#/, '');
    const params = getQueryStringParams(hash);
    const bootRequest = getBootRequest();

    // if we refreshed the boot-page we don't want to
    // redirect to this page so we force rootHash load
    const isDirectLoad = hash.indexOf(bootKey) !== -1;
    const ready = () => {
      const rootHash = getRootHash();

      if (routeExists(bootKey)) {
        resumeHash = isDirectLoad ? rootHash : hash || rootHash;
        navigate(bootKey);
      } else if (!hash && rootHash) {
        if (isString(rootHash)) {
          navigate(rootHash);
        } else if (isFunction(rootHash)) {
          rootHash().then(url => {
            navigate(url);
          });
        }
      } else {
        queue(hash);
        handleHashChange().then(() => {
          app._refocus();
        });
      }
    };
    if (isFunction(bootRequest)) {
      bootRequest(params)
        .then(() => {
          ready();
        })
        .catch(e => {
          if (routeExists('!')) {
            navigate('!', { request: { error: e } });
          } else {
            console.error(e);
          }
        });
    } else {
      ready();
    }
  };

  /**
   * start a new request
   * @param url
   * @param args
   * @param store
   */
  const navigate = (url, args = {}, store = true) => {
    if (isObject(url)) {
      url = getHashByName(url);
      if (!url) {
        return
      }
    }
    // push request in the queue
    queue(url, args, store);

    let hash = getHash();
    if (!mustUpdateLocationHash() && forcedHash) {
      hash = forcedHash;
    }
    if (hash.replace(/^#/, '') !== url) {
      setHash(url);
      if (!mustUpdateLocationHash()) {
        forcedHash = url;
        handleHashChange(url).then(() => {
          app._refocus();
        });
      }
    } else if (args.reload) {
      handleHashChange(url).then(() => {
        app._refocus();
      });
    }
  };

  const queue = (hash, args = {}, store = true) => {
    hash = hash.replace(/^#/, '');
    if (!navigateQueue.has(hash)) {
      for (let request of navigateQueue.values()) {
        request.cancel();
      }
      const request = createRequest(hash, args, store);
      navigateQueue.set(decodeURIComponent(hash), request);

      return request
    }
    return false
  };

  /**
   * Handle change of hash
   * @param override
   * @returns {Promise<void>}
   */
  const handleHashChange = async override => {
    const hash = (override || getHash()).replace(/^#/, '');
    const queueId = decodeURIComponent(hash);
    let request = navigateQueue.get(queueId);

    // handle hash updated manually
    if (!request && !navigateQueue.size) {
      request = queue(hash);
    }

    const route = getRouteByHash(hash);

    if (!route) {
      if (routeExists('*')) {
        navigate('*', { failedHash: hash });
      } else {
        console.error(`Unable to navigate to: ${hash}`);
      }
      return
    }

    // update current processed request
    request.hash = hash;
    request.route = route;

    let result = await beforeEachRoute(getActiveHash(), request);

    // test if a local hook is configured for the route
    if (route.beforeNavigate) {
      result = await route.beforeNavigate(getActiveHash(), request);
    }

    if (isBoolean(result)) {
      // only if resolve value is explicitly true
      // we continue the current route request
      if (result) {
        return resolveHashChange(request)
      }
    } else {
      // if navigation guard didn't return true
      // we cancel the current request
      request.cancel();
      navigateQueue.delete(queueId);

      if (isString(result)) {
        navigate(result);
      } else if (isObject(result)) {
        let store = true;
        if (isBoolean(result.store)) {
          store = result.store;
        }
        navigate(result.path, result.params, store);
      }
    }
  };

  /**
   * Continue processing the hash change if not blocked
   * by global or local hook
   * @param request - {}
   */
  const resolveHashChange = request => {
    const hash = request.hash;
    const route = request.route;
    const queueId = decodeURIComponent(hash);
    // store last requested hash so we can
    // prevent a route that resolved later
    // from displaying itself
    setLastHash(hash);

    if (route.path) {
      const component = getComponent(route.path);
      // if a hook is provided for the current route
      if (isFunction(route.hook)) {
        const urlParams = getValuesFromHash(hash, route.path);
        const params = {};
        for (const key of urlParams.keys()) {
          params[key] = urlParams.get(key);
        }
        route.hook(app, { ...params });
      }
      // if there is a component attached to the route
      if (component) {
        if (isPage(component)) {
          load(request).then(() => {
            app._refocus();
            navigateQueue.delete(queueId);
          });
        } else {
          // of the component is not a constructor
          // or a Component instance we can assume
          // that it's a dynamic import
          component()
            .then(contents => {
              return contents.default
            })
            .then(module => {
              storeComponent(route.path, module);
              return load(request)
            })
            .then(() => {
              app._refocus();
              navigateQueue.delete(queueId);
            });
        }
      } else {
        navigateQueue.delete(queueId);
      }
    }
  };

  /**
   * Directional step in history
   * @param direction
   */
  const step = (level = 0) => {
    if (!level || isNaN(level)) {
      return false
    }
    const history = getHistory();
    // for now we only support negative numbers
    level = Math.abs(level);

    // we can't step back past the amount
    // of history entries
    if (level > history.length) {
      if (isFunction(app._handleAppClose)) {
        return app._handleAppClose()
      }
      return false
    } else if (history.length) {
      // for now we only support history back
      const route = history.splice(history.length - level, level)[0];
      // store changed history
      setHistory(history);
      return navigate(
        route.hash,
        {
          [symbols.backtrack]: true,
          [symbols.historyState]: route.state,
        },
        false
      )
    } else if (routerConfig.get('backtrack')) {
      const hashLastPart = /(\/:?[\w%\s-]+)$/;
      let hash = stripRegex(getHash());
      let floor = getFloor(hash);

      // test if we got deep-linked
      if (floor > 1) {
        while (floor--) {
          // strip of last part
          hash = hash.replace(hashLastPart, '');
          // if we have a configured route
          // we navigate to it
          if (getRouteByHash(hash)) {
            return navigate(hash, { [symbols.backtrack]: true }, false)
          }
        }
      }
    }
    return false
  };

  /**
   * Resume Router's page loading process after
   * the BootComponent became visible;
   */
  const resume = () => {
    if (isString(resumeHash)) {
      navigate(resumeHash, false);
    } else if (isFunction(resumeHash)) {
      resumeHash().then(url => {
        navigate(url, false);
      });
    } else {
      console.warn('[Router]: resume() called but no hash found');
    }
  };

  /**
   * Query if the Router is still processing a Request
   * @returns {boolean}
   */
  const isNavigating = () => {
    if (navigateQueue.size) {
      let isProcessing = false;
      for (let request of navigateQueue.values()) {
        if (!request.isCancelled) {
          isProcessing = true;
        }
      }
      return isProcessing
    }
    return false
  };

  /**
   * By default we return the location hash
   * @returns {string}
   */
  let getHash = () => {
    return document.location.hash
  };

  /**
   * Update location hash
   * @param url
   */
  let setHash = url => {
    document.location.hash = url;
  };

  /**
   * On hash change we start processing
   */
  window.addEventListener('hashchange', async () => {
    if (mustUpdateLocationHash()) {
      await handleHashChange();
    }
  });

  // export API
  var Router = {
    startRouter,
    navigate,
    resume,
    step,
    go: step,
    back: step.bind(null, -1),
    activePage: getActivePage,
    getActivePage() {
      // warning
      return getActivePage()
    },
    getActiveRoute,
    getActiveHash,
    focusWidget,
    getActiveWidget,
    restoreFocus,
    isNavigating,
    getHistory,
    setHistory,
    getHistoryState,
    replaceHistoryState,
    App: RoutedApp,
    // keep backwards compatible
    focusPage: restoreFocus,
    /**
     * Deprecated api methods
     */
    setupRoutes() {
      console.warn('Router: setupRoutes is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    on() {
      console.warn('Router.on() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    before() {
      console.warn('Router.before() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    after() {
      console.warn('Router.after() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  [
    {
      number: 1,
      name: 'Metro News 1',
      description: 'New York Cable News Channel',
      entitled: true,
      program: {
        title: 'The Morning Show',
        description: "New York's best morning show",
        startTime: new Date(new Date() - 60 * 5 * 1000).toUTCString(), // started 5 minutes ago
        duration: 60 * 30, // 30 minutes
        ageRating: 0,
      },
    },
    {
      number: 2,
      name: 'MTV',
      description: 'Music Television',
      entitled: true,
      program: {
        title: 'Beavis and Butthead',
        description: 'American adult animated sitcom created by Mike Judge',
        startTime: new Date(new Date() - 60 * 20 * 1000).toUTCString(), // started 20 minutes ago
        duration: 60 * 45, // 45 minutes
        ageRating: 18,
      },
    },
    {
      number: 3,
      name: 'NBC',
      description: 'NBC TV Network',
      entitled: false,
      program: {
        title: 'The Tonight Show Starring Jimmy Fallon',
        description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
        startTime: new Date(new Date() - 60 * 10 * 1000).toUTCString(), // started 10 minutes ago
        duration: 60 * 60, // 1 hour
        ageRating: 10,
      },
    },
  ];

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let ApplicationInstance;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class VideoTexture extends Lightning.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: { type: Lightning.textures.StaticTexture, options: {} },
        },
      }
    }

    set videoEl(v) {
      this._videoEl = v;
    }

    get videoEl() {
      return this._videoEl
    }

    get videoView() {
      return this.tag('Video')
    }

    get videoTexture() {
      return this.videoView.texture
    }

    get isVisible() {
      return this.videoView.alpha === 1 && this.videoView.visible === true
    }

    _init() {
      this._createVideoTexture();
    }

    _createVideoTexture() {
      const stage = this.stage;

      const gl = stage.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };

      this.videoView.w = this.videoEl.width / this.stage.getRenderPrecision();
      this.videoView.h = this.videoEl.height / this.stage.getRenderPrecision();
    }

    start() {
      const stage = this.stage;
      if (!this._updateVideoTexture) {
        this._updateVideoTexture = () => {
          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
            const gl = stage.gl;

            const currentTime = new Date().getTime();

            // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
            // We'll fallback to fixed 30fps in this case.
            const frameCount = this.videoEl.webkitDecodedFrameCount;

            const mustUpdate = frameCount
              ? this._lastFrame !== frameCount
              : this._lastTime < currentTime - 30;

            if (mustUpdate) {
              this._lastTime = currentTime;
              this._lastFrame = frameCount;
              try {
                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                this.videoView.visible = true;

                this.videoTexture.options.w = this.videoEl.width;
                this.videoTexture.options.h = this.videoEl.height;
                const expectedAspectRatio = this.videoView.w / this.videoView.h;
                const realAspectRatio = this.videoEl.width / this.videoEl.height;

                if (expectedAspectRatio > realAspectRatio) {
                  this.videoView.scaleX = realAspectRatio / expectedAspectRatio;
                  this.videoView.scaleY = 1;
                } else {
                  this.videoView.scaleY = expectedAspectRatio / realAspectRatio;
                  this.videoView.scaleX = 1;
                }
              } catch (e) {
                Log.error('texImage2d video', e);
                this.stop();
              }
              this.videoTexture.source.forceRenderUpdate();
            }
          }
        };
      }
      if (!this._updatingVideoTexture) {
        stage.on('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = true;
      }
    }

    stop() {
      const stage = this.stage;
      stage.removeListener('frameStart', this._updateVideoTexture);
      this._updatingVideoTexture = false;
      this.videoView.visible = false;

      if (this.videoTexture.options.source) {
        const gl = stage.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }

    position(top, left) {
      this.videoView.patch({
        smooth: {
          x: left,
          y: top,
        },
      });
    }

    size(width, height) {
      this.videoView.patch({
        smooth: {
          w: width,
          h: height,
        },
      });
    }

    show() {
      this.videoView.setSmooth('alpha', 1);
    }

    hide() {
      this.videoView.setSmooth('alpha', 0);
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let mediaUrl$1 = url => url;
  let videoEl;
  let videoTexture;
  let metrics$1;
  let consumer;
  let precision = 1;
  let textureMode = false;

  // todo: add this in a 'Registry' plugin
  // to be able to always clean this up on app close
  let eventHandlers = {};

  const state = {
    adsEnabled: false,
    playing: false,
    _playingAds: false,
    get playingAds() {
      return this._playingAds
    },
    set playingAds(val) {
      if (this._playingAds !== val) {
        this._playingAds = val;
        fireOnConsumer(val === true ? 'AdStart' : 'AdEnd');
      }
    },
    skipTime: false,
    playAfterSeek: null,
  };

  const hooks = {
    play() {
      state.playing = true;
    },
    pause() {
      state.playing = false;
    },
    seeked() {
      state.playAfterSeek === true && videoPlayerPlugin.play();
      state.playAfterSeek = null;
    },
    abort() {
      deregisterEventListeners();
    },
  };

  const withPrecision = val => Math.round(precision * val) + 'px';

  const fireOnConsumer = (event, args) => {
    if (consumer) {
      consumer.fire('$videoPlayer' + event, args, videoEl.currentTime);
      consumer.fire('$videoPlayerEvent', event, args, videoEl.currentTime);
    }
  };

  const fireHook = (event, args) => {
    hooks[event] && typeof hooks[event] === 'function' && hooks[event].call(null, event, args);
  };

  const setupVideoTag = () => {
    const videoEls = document.getElementsByTagName('video');
    if (videoEls && videoEls.length) {
      return videoEls[0]
    } else {
      const videoEl = document.createElement('video');
      videoEl.setAttribute('id', 'video-player');
      videoEl.setAttribute('width', withPrecision(1920));
      videoEl.setAttribute('height', withPrecision(1080));
      videoEl.setAttribute('crossorigin', 'anonymous');
      videoEl.style.position = 'absolute';
      videoEl.style.zIndex = '1';
      videoEl.style.display = 'none';
      videoEl.style.visibility = 'hidden';
      videoEl.style.top = withPrecision(0);
      videoEl.style.left = withPrecision(0);
      videoEl.style.width = withPrecision(1920);
      videoEl.style.height = withPrecision(1080);
      document.body.appendChild(videoEl);
      return videoEl
    }
  };

  const setUpVideoTexture = () => {
    if (!ApplicationInstance.tag('VideoTexture')) {
      const el = ApplicationInstance.stage.c({
        type: VideoTexture,
        ref: 'VideoTexture',
        zIndex: 0,
        videoEl,
      });
      ApplicationInstance.childList.addAt(el, 0);
    }
    return ApplicationInstance.tag('VideoTexture')
  };

  const registerEventListeners = () => {
    Log.info('VideoPlayer', 'Registering event listeners');
    Object.keys(events).forEach(event => {
      const handler = e => {
        // Fire a metric for each event (if it exists on the metrics object)
        if (metrics$1 && metrics$1[event] && typeof metrics$1[event] === 'function') {
          metrics$1[event]({ currentTime: videoEl.currentTime });
        }
        // fire an internal hook
        fireHook(event, { videoElement: videoEl, event: e });

        // fire the event (with human friendly event name) to the consumer of the VideoPlayer
        fireOnConsumer(events[event], { videoElement: videoEl, event: e });
      };

      eventHandlers[event] = handler;
      videoEl.addEventListener(event, handler);
    });
  };

  const deregisterEventListeners = () => {
    Log.info('VideoPlayer', 'Deregistering event listeners');
    Object.keys(eventHandlers).forEach(event => {
      videoEl.removeEventListener(event, eventHandlers[event]);
    });
    eventHandlers = {};
  };

  const videoPlayerPlugin = {
    consumer(component) {
      consumer = component;
    },

    position(top = 0, left = 0) {
      videoEl.style.left = withPrecision(left);
      videoEl.style.top = withPrecision(top);
      if (textureMode === true) {
        videoTexture.position(top, left);
      }
    },

    size(width = 1920, height = 1080) {
      videoEl.style.width = withPrecision(width);
      videoEl.style.height = withPrecision(height);
      videoEl.width = parseFloat(videoEl.style.width);
      videoEl.height = parseFloat(videoEl.style.height);
      if (textureMode === true) {
        videoTexture.size(width, height);
      }
    },

    area(top = 0, right = 1920, bottom = 1080, left = 0) {
      this.position(top, left);
      this.size(right - left, bottom - top);
    },

    open(url, details = {}) {
      if (!this.canInteract) return
      metrics$1 = Metrics$1.media(url);
      // prep the media url to play depending on platform
      url = mediaUrl$1(url);

      // if url is same as current clear (which is effectively a reload)
      if (this.src == url) {
        this.clear();
      }

      this.hide();
      deregisterEventListeners();

      // preload the video to get duration (for ads)
      //.. currently actually not working because loadedmetadata didn't work reliably on Sky boxes
      videoEl.setAttribute('src', url);
      videoEl.load();

      // const onLoadedMetadata = () => {
      // videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
      const config = { enabled: state.adsEnabled, duration: 300 }; // this.duration ||
      if (details.videoId) {
        config.caid = details.videoId;
      }
      Ads.get(config, consumer).then(ads => {
        state.playingAds = true;
        ads.prerolls().then(() => {
          state.playingAds = false;
          registerEventListeners();
          if (this.src !== url) {
            videoEl.setAttribute('src', url);
            videoEl.load();
          }
          this.show();
          setTimeout(() => {
            this.play();
          });
        });
      });
      // }

      // videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
    },

    reload() {
      if (!this.canInteract) return
      const url = videoEl.getAttribute('src');
      this.close();
      this.open(url);
    },

    close() {
      Ads.cancel();
      if (state.playingAds) {
        state.playingAds = false;
        Ads.stop();
        // call self in next tick
        setTimeout(() => {
          this.close();
        });
      }
      if (!this.canInteract) return
      this.clear();
      this.hide();
      deregisterEventListeners();
    },

    clear() {
      if (!this.canInteract) return
      // pause the video first to disable sound
      this.pause();
      if (textureMode === true) videoTexture.stop();
      fireOnConsumer('Clear', { videoElement: videoEl });
      videoEl.removeAttribute('src');
      videoEl.load();
    },

    play() {
      if (!this.canInteract) return
      if (textureMode === true) videoTexture.start();
      videoEl.play();
    },

    pause() {
      if (!this.canInteract) return
      videoEl.pause();
    },

    playPause() {
      if (!this.canInteract) return
      this.playing === true ? this.pause() : this.play();
    },

    mute(muted = true) {
      if (!this.canInteract) return
      videoEl.muted = muted;
    },

    loop(looped = true) {
      videoEl.loop = looped;
    },

    seek(time) {
      if (!this.canInteract) return
      if (!this.src) return
      // define whether should continue to play after seek is complete (in seeked hook)
      if (state.playAfterSeek === null) {
        state.playAfterSeek = !!state.playing;
      }
      // pause before actually seeking
      this.pause();
      // currentTime always between 0 and the duration of the video (minus 0.1s to not set to the final frame and stall the video)
      videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1));
    },

    skip(seconds) {
      if (!this.canInteract) return
      if (!this.src) return

      state.skipTime = (state.skipTime || videoEl.currentTime) + seconds;
      easeExecution(() => {
        this.seek(state.skipTime);
        state.skipTime = false;
      }, 300);
    },

    show() {
      if (!this.canInteract) return
      if (textureMode === true) {
        videoTexture.show();
      } else {
        videoEl.style.display = 'block';
        videoEl.style.visibility = 'visible';
      }
    },

    hide() {
      if (!this.canInteract) return
      if (textureMode === true) {
        videoTexture.hide();
      } else {
        videoEl.style.display = 'none';
        videoEl.style.visibility = 'hidden';
      }
    },

    enableAds(enabled = true) {
      state.adsEnabled = enabled;
    },

    /* Public getters */
    get duration() {
      return videoEl && (isNaN(videoEl.duration) ? Infinity : videoEl.duration)
    },

    get currentTime() {
      return videoEl && videoEl.currentTime
    },

    get muted() {
      return videoEl && videoEl.muted
    },

    get looped() {
      return videoEl && videoEl.loop
    },

    get src() {
      return videoEl && videoEl.getAttribute('src')
    },

    get playing() {
      return state.playing
    },

    get playingAds() {
      return state.playingAds
    },

    get canInteract() {
      // todo: perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
      return state.playingAds === false
    },

    get top() {
      return videoEl && parseFloat(videoEl.style.top)
    },

    get left() {
      return videoEl && parseFloat(videoEl.style.left)
    },

    get bottom() {
      return videoEl && parseFloat(videoEl.style.top - videoEl.style.height)
    },

    get right() {
      return videoEl && parseFloat(videoEl.style.left - videoEl.style.width)
    },

    get width() {
      return videoEl && parseFloat(videoEl.style.width)
    },

    get height() {
      return videoEl && parseFloat(videoEl.style.height)
    },

    get visible() {
      if (textureMode === true) {
        return videoTexture.isVisible
      } else {
        return videoEl && videoEl.style.display === 'block'
      }
    },

    get adsEnabled() {
      return state.adsEnabled
    },

    // prefixed with underscore to indicate 'semi-private'
    // because it's not recommended to interact directly with the video element
    get _videoEl() {
      return videoEl
    },
  };

  autoSetupMixin(videoPlayerPlugin, () => {
    precision =
      
      precision;

    videoEl = setupVideoTag();

    textureMode = Settings.get('platform', 'textureMode', false);
    if (textureMode === true) {
      videoTexture = setUpVideoTexture();
    }
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let consumer$1;

  let getAds = () => {
    // todo: enable some default ads during development, maybe from the settings.json
    return Promise.resolve({
      prerolls: [],
      midrolls: [],
      postrolls: [],
    })
  };

  const state$1 = {
    active: false,
  };

  const playSlot = (slot = []) => {
    return slot.reduce((promise, ad) => {
      return promise.then(() => {
        return playAd(ad)
      })
    }, Promise.resolve(null))
  };

  const playAd = ad => {
    return new Promise(resolve => {
      if (state$1.active === false) {
        Log.info('Ad', 'Skipping add due to inactive state');
        return resolve()
      }
      // is it safe to rely on videoplayer plugin already created the video tag?
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.style.display = 'block';
      videoEl.style.visibility = 'visible';
      videoEl.src = mediaUrl$1(ad.url);
      videoEl.load();

      let timeEvents = null;
      let timeout;

      const cleanup = () => {
        // remove all listeners
        Object.keys(handlers).forEach(handler =>
          videoEl.removeEventListener(handler, handlers[handler])
        );
        resolve();
      };
      const handlers = {
        play() {
          Log.info('Ad', 'Play ad', ad.url);
          fireOnConsumer$1('Play', ad);
          sendBeacon(ad.callbacks, 'defaultImpression');
        },
        ended() {
          fireOnConsumer$1('Ended', ad);
          sendBeacon(ad.callbacks, 'complete');
          cleanup();
        },
        timeupdate() {
          if (!timeEvents && videoEl.duration) {
            // calculate when to fire the time based events (now that duration is known)
            timeEvents = {
              firstQuartile: videoEl.duration / 4,
              midPoint: videoEl.duration / 2,
              thirdQuartile: (videoEl.duration / 4) * 3,
            };
            Log.info('Ad', 'Calculated quartiles times', { timeEvents });
          }
          if (
            timeEvents &&
            timeEvents.firstQuartile &&
            videoEl.currentTime >= timeEvents.firstQuartile
          ) {
            fireOnConsumer$1('FirstQuartile', ad);
            delete timeEvents.firstQuartile;
            sendBeacon(ad.callbacks, 'firstQuartile');
          }
          if (timeEvents && timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
            fireOnConsumer$1('MidPoint', ad);
            delete timeEvents.midPoint;
            sendBeacon(ad.callbacks, 'midPoint');
          }
          if (
            timeEvents &&
            timeEvents.thirdQuartile &&
            videoEl.currentTime >= timeEvents.thirdQuartile
          ) {
            fireOnConsumer$1('ThirdQuartile', ad);
            delete timeEvents.thirdQuartile;
            sendBeacon(ad.callbacks, 'thirdQuartile');
          }
        },
        stalled() {
          fireOnConsumer$1('Stalled', ad);
          timeout = setTimeout(() => {
            cleanup();
          }, 5000); // make timeout configurable
        },
        canplay() {
          timeout && clearTimeout(timeout);
        },
        error() {
          fireOnConsumer$1('Error', ad);
          cleanup();
        },
        // this doesn't work reliably on sky box, moved logic to timeUpdate event
        // loadedmetadata() {
        //   // calculate when to fire the time based events (now that duration is known)
        //   timeEvents = {
        //     firstQuartile: videoEl.duration / 4,
        //     midPoint: videoEl.duration / 2,
        //     thirdQuartile: (videoEl.duration / 4) * 3,
        //   }
        // },
        abort() {
          cleanup();
        },
        // todo: pause, resume, mute, unmute beacons
      };
      // add all listeners
      Object.keys(handlers).forEach(handler => videoEl.addEventListener(handler, handlers[handler]));

      videoEl.play();
    })
  };

  const sendBeacon = (callbacks, event) => {
    if (callbacks && callbacks[event]) {
      Log.info('Ad', 'Sending beacon', event, callbacks[event]);
      return callbacks[event].reduce((promise, url) => {
        return promise.then(() =>
          fetch(url)
            // always resolve, also in case of a fetch error (so we don't block firing the rest of the beacons for this event)
            // note: for fetch failed http responses don't throw an Error :)
            .then(response => {
              if (response.status === 200) {
                fireOnConsumer$1('Beacon' + event + 'Sent');
              } else {
                fireOnConsumer$1('Beacon' + event + 'Failed' + response.status);
              }
            })
            .catch(() => {
            })
        )
      }, Promise.resolve(null))
    } else {
      Log.info('Ad', 'No callback found for ' + event);
    }
  };

  const fireOnConsumer$1 = (event, args) => {
    if (consumer$1) {
      consumer$1.fire('$ad' + event, args);
      consumer$1.fire('$adEvent', event, args);
    }
  };

  var Ads = {
    get(config, videoPlayerConsumer) {
      if (config.enabled === false) {
        return Promise.resolve({
          prerolls() {
            return Promise.resolve()
          },
        })
      }
      consumer$1 = videoPlayerConsumer;

      return new Promise(resolve => {
        Log.info('Ad', 'Starting session');
        getAds().then(ads => {
          Log.info('Ad', 'API result', ads);
          resolve({
            prerolls() {
              if (ads.preroll) {
                state$1.active = true;
                fireOnConsumer$1('PrerollSlotImpression', ads);
                sendBeacon(ads.preroll.callbacks, 'slotImpression');
                return playSlot(ads.preroll.ads).then(() => {
                  fireOnConsumer$1('PrerollSlotEnd', ads);
                  sendBeacon(ads.preroll.callbacks, 'slotEnd');
                  state$1.active = false;
                })
              }
              return Promise.resolve()
            },
            midrolls() {
              return Promise.resolve()
            },
            postrolls() {
              return Promise.resolve()
            },
          });
        });
      })
    },
    cancel() {
      Log.info('Ad', 'Cancel Ad');
      state$1.active = false;
    },
    stop() {
      Log.info('Ad', 'Stop Ad');
      state$1.active = false;
      // fixme: duplication
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.pause();
      videoEl.removeAttribute('src');
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class ScaledImageTexture extends Lightning.textures.ImageTexture {
    constructor(stage) {
      super(stage);
      this._scalingOptions = undefined;
    }

    set options(options) {
      this.resizeMode = this._scalingOptions = options;
    }

    _getLookupId() {
      return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
    }

    getNonDefaults() {
      const obj = super.getNonDefaults();
      if (this._src) {
        obj.src = this._src;
      }
      return obj
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  class PinInput extends Lightning.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 0xff949393,
        alpha: 0.5,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
        Nr: {
          w: w => w,
          y: 24,
          text: {
            text: '',
            textColor: 0xff333333,
            fontSize: 80,
            textAlign: 'center',
            verticalAlign: 'middle',
          },
        },
      }
    }

    set index(v) {
      this.x = v * (120 + 24);
    }

    set nr(v) {
      this._timeout && clearTimeout(this._timeout);

      if (v) {
        this.setSmooth('alpha', 1);
      } else {
        this.setSmooth('alpha', 0.5);
      }

      this.tag('Nr').patch({
        text: {
          text: (v && v.toString()) || '',
          fontSize: v === '*' ? 120 : 80,
        },
      });

      if (v && v !== '*') {
        this._timeout = setTimeout(() => {
          this._timeout = null;
          this.nr = '*';
        }, 750);
      }
    }
  }

  class PinDialog extends Lightning.Component {
    static _template() {
      return {
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xdd000000,
        alpha: 0.000001,
        Dialog: {
          w: 648,
          h: 320,
          y: h => (h - 320) / 2,
          x: w => (w - 648) / 2,
          rect: true,
          color: 0xdd333333,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
          Info: {
            y: 24,
            x: 48,
            text: { text: 'Please enter your PIN', fontSize: 32 },
          },
          Msg: {
            y: 260,
            x: 48,
            text: { text: '', fontSize: 28, textColor: 0xffffffff },
          },
          Code: {
            x: 48,
            y: 96,
          },
        },
      }
    }

    _init() {
      const children = [];
      for (let i = 0; i < 4; i++) {
        children.push({
          type: PinInput,
          index: i,
        });
      }

      this.tag('Code').children = children;
    }

    get pin() {
      if (!this._pin) this._pin = '';
      return this._pin
    }

    set pin(v) {
      if (v.length <= 4) {
        const maskedPin = new Array(Math.max(v.length - 1, 0)).fill('*', 0, v.length - 1);
        v.length && maskedPin.push(v.length > this._pin.length ? v.slice(-1) : '*');
        for (let i = 0; i < 4; i++) {
          this.tag('Code').children[i].nr = maskedPin[i] || '';
        }
        this._pin = v;
      }
    }

    get msg() {
      if (!this._msg) this._msg = '';
      return this._msg
    }

    set msg(v) {
      this._timeout && clearTimeout(this._timeout);

      this._msg = v;
      if (this._msg) {
        this.tag('Msg').text = this._msg;
        this.tag('Info').setSmooth('alpha', 0.5);
        this.tag('Code').setSmooth('alpha', 0.5);
      } else {
        this.tag('Msg').text = '';
        this.tag('Info').setSmooth('alpha', 1);
        this.tag('Code').setSmooth('alpha', 1);
      }
      this._timeout = setTimeout(() => {
        this.msg = '';
      }, 2000);
    }

    _firstActive() {
      this.setSmooth('alpha', 1);
    }

    _handleKey(event) {
      if (this.msg) {
        this.msg = false;
      } else {
        const val = parseInt(event.key);
        if (val > -1) {
          this.pin += val;
        }
      }
    }

    _handleBack() {
      if (this.msg) {
        this.msg = false;
      } else {
        if (this.pin.length) {
          this.pin = this.pin.slice(0, this.pin.length - 1);
        } else {
          Pin.hide();
          this.resolve(false);
        }
      }
    }

    _handleEnter() {
      if (this.msg) {
        this.msg = false;
      } else {
        Pin.submit(this.pin)
          .then(val => {
            this.msg = 'Unlocking ...';
            setTimeout(() => {
              Pin.hide();
            }, 1000);
            this.resolve(val);
          })
          .catch(e => {
            this.msg = e;
            this.reject(e);
          });
      }
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  // only used during local development
  let unlocked = false;

  let submit = pin => {
    return new Promise((resolve, reject) => {
      if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
        unlocked = true;
        resolve(unlocked);
      } else {
        reject('Incorrect pin');
      }
    })
  };

  let check = () => {
    return new Promise(resolve => {
      resolve(unlocked);
    })
  };

  let pinDialog = null;

  // Public API
  var Pin = {
    show() {
      return new Promise((resolve, reject) => {
        pinDialog = ApplicationInstance.stage.c({
          ref: 'PinDialog',
          type: PinDialog,
          resolve,
          reject,
        });
        ApplicationInstance.childList.a(pinDialog);
        ApplicationInstance.focus = pinDialog;
      })
    },
    hide() {
      ApplicationInstance.focus = null;
      ApplicationInstance.children = ApplicationInstance.children.map(
        child => child !== pinDialog && child
      );
      pinDialog = null;
    },
    submit(pin) {
      return new Promise((resolve, reject) => {
        try {
          submit(pin)
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
    unlocked() {
      return new Promise((resolve, reject) => {
        try {
          check()
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
    locked() {
      return new Promise((resolve, reject) => {
        try {
          check()
            .then(unlocked => resolve(!!!unlocked))
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
  };

  class Letter extends Lightning.Component {

    _init() {
      this.tag('LetterMain').patch({ color: this.color, text: { text: this.buttonText, color: this.textColor, textAlign: this.textAlign } });
    }

    static _template() {
      return {
        Text: {
          LetterMain: {
            rect: true, w: 50, h: 50, color: '', x: '', y: '', text: {
              text: '', color: '', textAlign: '', fontSize: 30
            }
          }
        }
      }
    }
  }

  class App extends Lightning.Application {

    static _states() {
      return [
        class HandleLeftKeyClick extends this {
          _getFocused() {
            return this.tag('HandleLeftKeyClick');
          }
        },

        class HandleRightKeyClick extends this {
          _getFocused(event) {
            return this.tag('HandleRightKeyClick');
          }
        },
      ]
    }

    /**
     * @method _init
     */
    _init() {
      this.lettersArray = [];
      console.clear();
      console.log('Starting Sky App...');
    }

    /**
     * @method handleLeft
     */
    _handleLeft() {
      this._setState('HandleLeftKeyClick');
      this.handleLeft();
    }

    /**
     * @method handleRight`
     */
    _handleRight() {
      this._setState('HandleRightKeyClick');
      this.handleRight();
    }

    /**
     * @method handleClick
     * @returns {int} elemPosX
     */
    handleClick() {
      let elemPosX = this.tag('LetterList').getSmooth('x');
      return elemPosX
    }

    /**
     * @method handleLeft - deals with the left arrow key press
     */
    handleLeft() {
      let elemPosX = Math.ceil(this.handleClick() - 50);
      this.tag('LetterList').setSmooth("x", elemPosX);
      this.currentXPos = elemPosX;
      this.getLetter();
    }

    /**
     * @method handleInsert - deals with the insert key press
     */
    _handleInsert() {
      this.lettersArray.push(this.letterSelected);
      let result = this.lettersArray.map(item => {
        return item
      });
      console.log(this.lettersArray);
      this.tag('Choice').text.text = result;
    }

    /**
     * @method handleDelete - deals with the delete key press
     */
    _handleDelete() {
      this.lettersArray.pop();
      let result = this.lettersArray.map(item => {
        return item
      });
      this.tag('Choice').text.text = result;
    }

    /**
     * @method handleRight - deals with the right arrow click
     */
    handleRight() {
      let elemPosX = Math.ceil(this.handleClick() + 50);
      this.tag('LetterList').setSmooth("x", elemPosX);
      this.currentXPos = elemPosX;
      this.getLetter();
    }

    /**
     * @method getLetter - gets letter on the left arrow click
     * @returns {string} this.letterSelected
     */
    getLetter() {
      const lettersArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

      if (this.currentXPos < 0) {
        this.currentXPos = this.currentXPos * -1;
        let arrayIndex = lettersArr[this.currentXPos / 50];
        this.letterSelected = arrayIndex;
        return this.letterSelected
      }
      else {
        // prevent from overscrolling 
        this.tag('LetterList').setSmooth("x", 0);
      }

    }

    static _template() {
      this.y = 120;
      this.color = 0xff005500;
      this.textColor = 0xaaaaaaaa;
      this.textAlign = 'center';
      this.letterSelected = "";
      this.letterArray = [];
      return {
        Header: {
          y: 20, text: { text: 'Press an arrow key to select a letter...', textColor: 0xaa000000, textAlign: 'left', fontSize: 30 }
        },
        SelectionBox: {
          y: this.y, x: 0, w: 50, h: 50, rect: true, colorTop: 0x4d636EFB, colorBottom: 0x4d1C27bC, zIndex: 1
        },
        LetterList: {
          A: {
            type: Letter, buttonText: 'a', color: this.textColor, textAlign: this.textAlign, x: 0, y: 120
          },
          B: {
            type: Letter, buttonText: 'b', color: this.textColor, textAlign: this.textAlign, x: 50, y: this.y
          },
          C: {
            type: Letter, buttonText: 'c', color: this.textColor, textAlign: this.textAlign, x: 100, y: this.y
          },
          D: {
            type: Letter, buttonText: 'd', color: this.textColor, textAlign: this.textAlign, x: 150, y: this.y
          },
          E: {
            type: Letter, buttonText: 'e', color: this.textColor, textAlign: this.textAlign, x: 200, y: this.y
          },
          F: {
            type: Letter, buttonText: 'f', color: this.textColor, textAlign: this.textAlign, x: 250, y: this.y
          },
          G: {
            type: Letter, buttonText: 'g', color: this.textColor, textAlign: this.textAlign, x: 300, y: this.y
          },
          H: {
            type: Letter, buttonText: 'h', color: this.textColor, textAlign: this.textAlign, x: 350, y: this.y
          },
          I: {
            type: Letter, buttonText: 'i', color: this.textColor, textAlign: this.textAlign, x: 400, y: this.y
          },
          J: {
            type: Letter, buttonText: 'j', color: this.textColor, textAlign: this.textAlign, x: 450, y: this.y
          },
          K: {
            type: Letter, buttonText: 'k', color: this.textColor, textAlign: this.textAlign, x: 500, y: this.y
          },
          L: {
            type: Letter, buttonText: 'l', color: this.textColor, textAlign: this.textAlign, x: 550, y: this.y
          },
          M: {
            type: Letter, buttonText: 'm', color: this.textColor, textAlign: this.textAlign, x: 600, y: this.y
          },
          N: {
            type: Letter, buttonText: 'n', color: this.textColor, textAlign: this.textAlign, x: 650, y: this.y
          },
          O: {
            type: Letter, buttonText: 'o', color: this.textColor, textAlign: this.textAlign, x: 700, y: this.y
          },
          P: {
            type: Letter, buttonText: 'p', color: this.textColor, textAlign: this.textAlign, x: 750, y: this.y
          },
          Q: {
            type: Letter, buttonText: 'q', color: this.textColor, textAlign: this.textAlign, x: 800, y: this.y
          },
          R: {
            type: Letter, buttonText: 'r', color: this.textColor, textAlign: this.textAlign, x: 850, y: this.y
          },
          S: {
            type: Letter, buttonText: 's', color: this.textColor, textAlign: this.textAlign, x: 900, y: this.y
          },
          T: {
            type: Letter, buttonText: 't', color: this.textColor, textAlign: this.textAlign, x: 950, y: this.y
          },
          U: {
            type: Letter, buttonText: 'u', color: this.textColor, textAlign: this.textAlign, x: 1000, y: this.y
          },
          V: {
            type: Letter, buttonText: 'v', color: this.textColor, textAlign: this.textAlign, x: 1050, y: this.y
          },
          W: {
            type: Letter, buttonText: 'w', color: this.textColor, textAlign: this.textAlign, x: 1100, y: this.y
          },
          X: {
            type: Letter, buttonText: 'x', color: this.textColor, textAlign: this.textAlign, x: 1150, y: this.y
          },
          Y: {
            type: Letter, buttonText: 'y', color: this.textColor, textAlign: this.textAlign, x: 1200, y: this.y
          },
          Z: {
            type: Letter, buttonText: 'z', color: this.textColor, textAlign: this.textAlign, x: 1250, y: this.y
          }
        },
        Choice: {
          y: 180, x: 50, text: { text: 'Your choice is...', textColor: 0xaa000000, textAlign: 'left', fontSize: 30 }
        }
      }
    };

  }

  // to deal with key pressing we must add stagingn options to the
  const options = { stage: { w: window.innerWidth, h: window.innerHeight, useImageWorker: false } };
  options.keys = {
    37: "Left",
    39: "Right",
    45: "Insert",
    46: "Delete"
  };

  const app$1 = new App(options);
  document.body.appendChild(app$1.stage.getCanvas());

  return App;

}());
//# sourceMappingURL=appBundle.js.map
