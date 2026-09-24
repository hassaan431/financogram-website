const fs = require('fs');
let content = fs.readFileSync('calculators/education.html', 'utf8');

const missingStyles = `
        .card-form { margin-bottom: 24px; }
        .field { margin-bottom: 18px; }
        .card-form label {
            display: block;
            font-size: 13.5px;
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--text-main);
        }
        .hint {
            font-size: 12.5px;
            color: var(--text-muted);
            margin-top: 5px;
        }
        .input-row { position: relative; }
        .rs {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 15px;
            color: var(--text-muted);
            font-weight: 500;
        }
        .pct {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 15px;
            color: var(--text-muted);
            font-weight: 500;
        }
        input[type="number"] {
            width: 100%;
            padding: 12px 14px;
            font-size: 16px;
            font-family: 'Inter', sans-serif;
            border: 1.5px solid var(--border-color);
            border-radius: 9px;
            background: var(--bg-card);
            color: var(--text-main);
            outline: none;
            transition: border-color 0.15s ease;
            -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .input-row:has(.rs) input[type="number"] {
            padding-left: 38px;
        }
        .input-row:has(.pct) input[type="number"], .pct-input {
            padding-right: 34px !important;
        }
        /* Fallback for browsers without :has */
        input[type="number"]#fee, input[type="number"]#onetime, input[type="number"]#initial {
            padding-left: 38px;
        }
        input[type="number"]:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.15);
        }
        .stat {
            background: var(--bg-card);
            border: 1.5px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
        }
        .stat .label {
            font-size: 12.5px;
            font-weight: 600;
            color: var(--text-muted);
            margin-bottom: 6px;
        }
        .stat .value {
            font-family: 'Fraunces', serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--text-main);
            line-height: 1.2;
        }
`;

content = content.replace('</style>', missingStyles + '\n    </style>');
fs.writeFileSync('calculators/education.html', content);
console.log('Fixed styling');
