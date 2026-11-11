/**
 * Financogram Web Analytics Integration
 * Includes PostHog and Vercel Web Analytics
 * Auto-captures pageviews, session recordings, interactions, and custom conversion events.
 */

// ============================================================================
// Vercel Web Analytics
// ============================================================================
(function () {
    window.va = window.va || function () { 
        (window.vaq = window.vaq || []).push(arguments); 
    };
})();

// ============================================================================
// PostHog Web Analytics Integration
// ============================================================================
(function () {
    const POSTHOG_API_KEY = 'phc_ybBna2UqwJe3xqaqz9PxcG96RHEbhFgVQYvsBUzzE4cW';
    const POSTHOG_HOST = 'https://us.i.posthog.com';

    // Prevent duplicate loading
    if (window.posthog && window.posthog.__SV) return;

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

    // Helper functions for easy tracking across Financogram
    window.FinancoAnalytics = {
        track: function (eventName, properties) {
            if (window.posthog && typeof window.posthog.capture === 'function') {
                window.posthog.capture(eventName, properties);
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
})();
