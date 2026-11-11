/**
 * Financogram Unified Analytics Integration
 * Supports Vercel Web Analytics, Vercel Speed Insights, and PostHog.
 * Auto-captures pageviews, activities, calculator usage, CTA interactions, and custom conversions.
 */
(function () {
    // -------------------------------------------------------------
    // 1. Vercel Web Analytics & Speed Insights Initialization
    // -------------------------------------------------------------
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };

    // Inject Vercel tracking scripts if not already present in the DOM
    if (!document.querySelector('script[src*="/_vercel/insights/script.js"]')) {
        const vaScript = document.createElement('script');
        vaScript.defer = true;
        vaScript.src = '/_vercel/insights/script.js';
        document.head.appendChild(vaScript);
    }
    if (!document.querySelector('script[src*="/_vercel/speed-insights/script.js"]')) {
        const siScript = document.createElement('script');
        siScript.defer = true;
        siScript.src = '/_vercel/speed-insights/script.js';
        document.head.appendChild(siScript);
    }

    // -------------------------------------------------------------
    // 2. PostHog Web Analytics Integration
    // -------------------------------------------------------------
    const POSTHOG_API_KEY = 'phc_ybBna2UqwJe3xqaqz9PxcG96RHEbhFgVQYvsBUzzE4cW';
    const POSTHOG_HOST = 'https://us.i.posthog.com';

    // Prevent duplicate loading
    if (!window.posthog || !window.posthog.__SV) {
        const posthog = window.posthog = window.posthog || [];
        if (!posthog.__SV) {
            posthog._i = [];
            posthog.init = function (apiKey, config, name) {
                function stub(target, method) {
                    const parts = method.split('.');
                    if (parts.length === 2) {
                        target = target[parts[0]];
                        method = parts[1];
                    }
                    target[method] = function () {
                        target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                }
                let instance = posthog;
                if (name !== undefined) {
                    instance = posthog[name] = [];
                }
                instance.people = instance.people || [];
                instance.toString = function (stubOnly) {
                    let str = 'posthog';
                    if (name !== undefined) str += '.' + name;
                    if (!stubOnly) str += ' (stub)';
                    return str;
                };
                instance.people.toString = function () {
                    return instance.toString(1) + '.people (stub)';
                };
                const methods = [
                    'init', 'capture', 'register', 'register_once', 'register_for_session',
                    'unregister', 'unregister_for_session', 'getFeatureFlag', 'getFeatureFlagPayload',
                    'isFeatureEnabled', 'reloadFeatureFlags', 'updateEarlyAccessFeatureEnrollment',
                    'getEarlyAccessFeatures', 'on', 'onFeatureFlags', 'onSessionId', 'getSurveys',
                    'getActiveMatchingSurveys', 'renderSurvey', 'canRenderSurvey', 'getNextSurveyStep',
                    'identify', 'setPersonProperties', 'group', 'resetGroups',
                    'setPersonPropertiesForFlags', 'resetPersonPropertiesForFlags',
                    'setGroupPropertiesForFlags', 'resetGroupPropertiesForFlags', 'reset',
                    'get_distinct_id', 'getGroups', 'get_session_id', 'get_session_replay_url',
                    'alias', 'set_config', 'startSessionRecording', 'stopSessionRecording',
                    'sessionRecordingStarted', 'captureException', 'loadToolbar', 'get_property',
                    'getSessionProperty', 'createPersonProfile', 'opt_in_capturing',
                    'opt_out_capturing', 'has_opted_in_capturing', 'has_opted_out_capturing',
                    'clear_opt_in_out_capturing', 'debug'
                ];
                for (let k = 0; k < methods.length; k++) {
                    stub(instance, methods[k]);
                }
                posthog._i.push([apiKey, config, name]);
            };
            posthog.__SV = 1;

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.crossOrigin = 'anonymous';
            script.async = true;
            script.src = POSTHOG_HOST.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
            const firstScript = document.getElementsByTagName('script')[0];
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            } else {
                document.head.appendChild(script);
            }
        }

        // Initialize PostHog configuration
        posthog.init(POSTHOG_API_KEY, {
            api_host: POSTHOG_HOST,
            person_profiles: 'identified_only',
            capture_pageview: true,
            capture_pageleave: true,
            autocapture: true,
            session_recording: {
                maskAllInputs: true,
                maskTextSelector: '.mask-private'
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Helper to Sanitize Properties for Vercel Analytics Custom Events
    // -------------------------------------------------------------
    function sanitizeForVercel(props) {
        if (!props || typeof props !== 'object') return {};
        const out = {};
        for (const [k, v] of Object.entries(props)) {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                out[k] = v;
            } else if (v !== null && v !== undefined) {
                out[k] = String(v);
            }
        }
        return out;
    }

    // -------------------------------------------------------------
    // 4. Unified Tracking API (FinancoAnalytics)
    // -------------------------------------------------------------
    window.FinancoAnalytics = {
        /**
         * Track a custom event across both Vercel Analytics and PostHog
         */
        track: function (eventName, properties) {
            // PostHog event capture
            if (window.posthog && typeof window.posthog.capture === 'function') {
                window.posthog.capture(eventName, properties);
            }
            // Vercel Web Analytics custom event
            if (typeof window.va === 'function') {
                window.va('event', {
                    name: eventName,
                    data: sanitizeForVercel(properties)
                });
            }
        },
        trackCalculator: function (toolName, details) {
            this.track('calculator_calculated', Object.assign({
                tool: toolName,
                path: window.location.pathname
            }, details || {}));
        },
        trackConsultationStep: function (stepNumber, stepTitle, extra) {
            this.track('consultation_step_completed', Object.assign({
                step_number: stepNumber,
                step_title: stepTitle
            }, extra || {}));
        },
        trackConsultationSubmit: function (status, details) {
            this.track('consultation_submitted', Object.assign({
                status: status // 'email_success', 'email_error', 'whatsapp_redirect'
            }, details || {}));
        }
    };

    // -------------------------------------------------------------
    // 5. Automatic Activity & Interaction Tracking
    // -------------------------------------------------------------
    document.addEventListener('click', function (e) {
        // Track Calculator Action Buttons (Calculate, Apply, Play)
        const calcBtn = e.target.closest('button.calc, button.apply-btn, button.e1-btn, button.e2-btn, button.play-btn');
        if (calcBtn) {
            const btnText = (calcBtn.textContent || '').trim().slice(0, 40);
            window.FinancoAnalytics.track('calculator_action_clicked', {
                button_text: btnText,
                page_path: window.location.pathname
            });
            return;
        }

        // Track Outbound & Key Navigation Links
        const link = e.target.closest('a[href]');
        if (link && link.href) {
            const href = link.href;

            // WhatsApp click
            if (href.includes('wa.me') || href.includes('whatsapp.com')) {
                window.FinancoAnalytics.track('whatsapp_clicked', {
                    href: href,
                    page_path: window.location.pathname
                });
            }
            // Instagram click
            else if (href.includes('instagram.com')) {
                window.FinancoAnalytics.track('instagram_clicked', {
                    href: href,
                    page_path: window.location.pathname
                });
            }
            // Consultation booking CTA link
            else if (href.includes('consultancy.html')) {
                window.FinancoAnalytics.track('consultation_cta_clicked', {
                    link_text: (link.textContent || '').trim().slice(0, 40),
                    from_page: window.location.pathname
                });
            }
            // General external link
            else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                window.FinancoAnalytics.track('outbound_link_clicked', {
                    destination: href,
                    page_path: window.location.pathname
                });
            }
        }
    }, { passive: true });
})();
