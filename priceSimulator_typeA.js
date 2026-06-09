//////////////////////////////////////////////////////
//部屋タイプA

function calculatePrice_A(date, hours, checkInTime, checkOutTime, calculateCheckInTime, isSaturdayOrDaysOff, isWeekendOrHoliday){
    let price = 0;
    let plan = ' ';
    // ルームタイプによる料金設定
    const prices = {
        short: 6000,
        rest: 7800,
        midnight_rest: 8800,
        midnight_stay: 13800,
        stay: 13800
    };

    // 延長料金設定
    const extensionFees = {
        A: 1400
    };

    // 
    const roomType = 'A';
    
    // 超過時間を計算
    const calculateExtensionCharges = (extraHours) => {
        return Math.ceil(extraHours * 60 / 30) * extensionFees[roomType]; // 30分ごとの延長料金を計算
    };

    const calculatePreExtensionCharges = (preExtraHours) => {
        return Math.ceil(preExtraHours * 60 / 30) * extensionFees[roomType]; // 30分ごとの延長料金を計算
    };

    // **プラン適用ロジック**


    // ① ショートプラン (6:00-26:00間、90分以内の利用)
    if (((checkInTime >= 6 && checkInTime < 24) || (checkInTime >= 0 && checkInTime < 2)) && hours <= 2) {
        if ((checkInTime >= 6 && checkInTime < 24) || checkInTime === 0) {
            if(hours <= 1.5){
                price = prices.short;
                plan = "ショート";
                return {price, plan};
            }
            else {
                // 1.5時間を超えた場合は、ショート料金に延長料金を加算
                let extraHours = 0.5; // 1.5時間を超える分を延長時間として計算
                price = prices.short + calculateExtensionCharges(extraHours);
                const extension = extraHours * 60 / 30;
                plan = "ショート + 延長" + extension + "本";
                return {price, plan};
            }
        }
        else if ((checkInTime >= 0 && checkInTime < 2) &&checkOutTime < 2.5 * 60) {
            price = prices.short;
            plan = "ショート";
            return {price, plan};
        }
        else {
            price = prices.midnight_rest;
            plan = "深夜休憩";
            return {price, plan};
        }
    }

    // 土日祝
    else if(isWeekendOrHoliday(date)) {
        // 6：00〜9：30にチェックイン
        if(checkInTime >= 6 && checkInTime < 10){
            if(checkOutTime <= 16 * 60 && hours <= 10){
                price = prices.rest;
                plan = "休憩(サービスタイム1部)";
                return {price, plan};
            }
            else if((checkOutTime <= 18.5 * 60 && checkOutTime > 16 * 60) && hours <= 12.5){
                // 前延長＋休憩(＋延長)
                if(checkInTime > 7 && checkOutTime === 18.5 * 60){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                // 前延長＋休憩(＋延長)
                else if(checkInTime === 8 && hours >= 10){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                // 前延長＋休憩(＋延長)
                else if(checkInTime === 8.5 && hours >= 9){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                // 前延長＋休憩(＋延長)
                else if(checkInTime === 9 && hours >= 8){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                // 前延長＋休憩(＋延長)
                else if(checkInTime === 9.5){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                // チェックアウトが16:00を超える場合の処理
                else{
                    const extraMinutes = Math.max(checkOutTime - 16 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム1部) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            // サービス＋休憩(22時までにチェックアウトの場合)
            else if((checkOutTime <= 22 * 60 && checkOutTime > 18.5 * 60) && hours <= 16){
                if(checkInTime > 7 && hours < 12){
                    // 前延長＋休憩(＋延長)
                    if(checkInTime === 7.5){
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                    else if(checkInTime === 8){
                        if(checkOutTime <= 19 * 60){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                    else if(checkInTime === 8.5){
                        if(checkOutTime <= 19 * 60){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                    else if(checkInTime === 9){
                        if(checkOutTime <= 19 * 60){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                    else if(checkInTime === 9.5){
                        if(checkOutTime <= 19 * 60){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                }
                else{
                    price = prices.rest * 2 ;
                    plan = "休憩(サービスタイム1部) + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
            }
            // サービス＋休憩＋延長(25時までにチェックアウトの場合)
            else if((checkOutTime <= 24 * 60 && checkOutTime > 22 * 60) && hours < 19){
                if(checkInTime === 9){
                    if(checkOutTime === 23 * 60){
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間)";
                        return {price, plan};
                    }
                    else if(checkOutTime === 23.5 * 60){
                        const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                if(checkInTime === 9.5 && checkOutTime >= 22 * 60){
                    if(checkOutTime <= 23 * 60){
                        const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間)";
                        return {price, plan};
                    }
                    else{
                        const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                else{
                    const extraMinutes = Math.max(checkOutTime - 22 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム1部) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            // サービス＋休憩＋延長(25時までにチェックアウトの場合)
            else if(checkOutTime < 1 * 60 && hours < 19){
                if(checkInTime === 9){
                    const extraMinutes = Math.max(checkOutTime + 1 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(checkInTime === 9.5){
                    const extraMinutes = Math.max(checkOutTime + 1 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
                else{
                    const extraMinutes = Math.max(checkOutTime + 60 * 2); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム1部) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan}; 
                }
            }
            // サービス1＋サービス3＋延長(25時までにチェックアウトの場合)
            else if((checkOutTime <= 2 * 60 && checkOutTime >= 1 * 60) && hours <= 20){
                if(checkInTime === 9.5){
                    if(checkOutTime === 1 * 60){
                        const extraMinutes = Math.max(checkOutTime + 1 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                        return {price, plan};
                    }
                    else{
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest + prices.stay;
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 宿泊1部";
                        return {price, plan};
                    }
                }
                else{
                    price = prices.rest * 3;
                    plan = "休憩(サービスタイム1部) + 休憩(サービスタイム3部) + 休憩(4時間)";
                    return {price, plan};
                } 
            }
            // サービス1部+延長4本+宿泊1部
            else {
                if(checkInTime > 8){
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest + prices.stay;
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 宿泊1部";
                    return {price, plan};
                }
                else{
                    const extraHours = 2.0;
                    price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                    plan = "休憩(サービスタイム1部) + 延長4本 + 宿泊1部";
                    return {price, plan};
                } 
            }
        }
        // 10：00〜13：30にチェックイン
        if(checkInTime >= 10 && checkInTime < 14){
            if(checkOutTime <= 19 * 60 && hours <= 9){
                price = prices.rest;
                plan = "休憩(サービスタイム2部)";
                return {price, plan};
            }
            else if((checkOutTime < 22 * 60 && checkOutTime > 19 * 60) && hours <= 11.5){
                //前延長＋休憩
                if((checkInTime > 11 && checkInTime <= 13) && checkOutTime === 21.5 * 60){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 12 && hours >= 9){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 12.5 && hours >= 8){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 13 && hours >= 7){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 13.5 && hours >= 6){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                // チェックアウトが19:00を超える場合の処理
                else{
                    const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            // サービス＋休憩(23時までにチェックアウトの場合)
            else if((checkOutTime <= 23 * 60 && checkOutTime >= 22 * 60) && hours <= 13){
                if((checkInTime > 11 && checkInTime <= 13) && checkOutTime === 22 * 60){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 13.5 && hours === 8.5){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime >= 12 && checkOutTime === 22.5 * 60){
                    const extraMinutes = Math.max(checkOutTime - 22 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(checkInTime > 12 && checkOutTime === 23 * 60){
                    const extraMinutes = Math.max(checkOutTime - 22 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else{
                    price = prices.rest * 2 ;
                    plan = "休憩(サービスタイム2部) + 休憩(4時間)";
                    return {price, plan};
                }
            }
            // サービス＋休憩＋延長(25時までにチェックアウトの場合)
            else if((checkOutTime <= 24 * 60 && checkOutTime > 23 * 60) && hours <= 15){
                if(checkInTime > 12){
                    const extraMinutes = Math.max(checkOutTime - 22 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else{
                    const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本"; 
                    return {price, plan};
                }
            }
            // サービス＋休憩＋延長(25時までにチェックアウトの場合)
            else if(checkOutTime <= 1 * 60 && hours <= 15){
                if(checkInTime > 12 && checkOutTime < 1 * 60){
                    const extraMinutes = Math.max(2 * 60 + checkOutTime); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(checkInTime >= 12 && checkOutTime === 1 * 60){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 休憩(4時間)";
                    return {price, plan};
                }
                else{
                    const extraMinutes = Math.max(checkOutTime + 1 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            // サービス2部+宿泊1部
            else if (checkOutTime <= 12 * 60) {
                if(checkInTime >= 12 && checkOutTime <= 2 * 60){
                    const extraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 休憩(4時間)";
                    return {price, plan};
                }
                else{
                    price = prices.rest + prices.stay;
                    plan = "休憩(サービスタイム2部) + 宿泊1部";
                    return {price, plan};
                }
            }
            // サービス2部+宿泊1部＋延長
            else {
                const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                const extension = extraHours * 60 / 30;
                plan = "休憩(サービスタイム2部) + 宿泊1部 + 延長" + extension + "本";
                return {price, plan};
            }
        }
        // 14：00〜17：30にチェックイン
        else if(checkInTime >= 14 && checkInTime < 18){
            if((checkOutTime <= 22 * 60 && checkOutTime >= 14 * 60) && hours <= 8){
                price = prices.rest;
                plan = "休憩(サービスタイム3部)";
                return {price, plan};
            }
            // サービス＋延長(25時までにチェックアウトの場合)
            else if((checkOutTime <= 24 * 60 && checkOutTime > 22 * 60) && hours <= 10.5){
                // チェックアウトが19:00を超える場合の処理
                const extraMinutes = Math.max(checkOutTime - 22 * 60); 
                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                price = prices.rest + calculateExtensionCharges(extraHours);
                const extension = extraHours * 60 / 30;
                plan = "休憩(サービスタイム3部) + 延長" + extension + "本";
                return {price, plan};
            }
            // サービス＋延長(25時までにチェックアウトの場合)
            else if(checkOutTime < 1 * 60 && hours <= 10.5){
                const extraMinutes = Math.max(checkOutTime + 60 * 2); 
                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                price = prices.rest + calculateExtensionCharges(extraHours);
                const extension = extraHours * 60 / 30;
                plan = "休憩(サービスタイム3部)+ 延長" + extension + "本";
                return {price, plan};
            }
            // サービス＋休憩(26時までにチェックアウトの場合)
            else if((checkOutTime <= 2 * 60 && checkOutTime >= 1 * 60) && hours <= 12){
                if(checkInTime === 17.5){
                    const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay;
                    plan = "前延長" + preExtension + "本 + 宿泊1部";
                    return {price, plan};
                }
                else{
                    price = prices.rest * 2 ;
                    plan = "休憩(サービスタイム3部) + 休憩(4時間)";
                    return {price, plan};
                }
            }
            // // サービス3部+宿泊2部
            else if(checkOutTime <= 14 * 60 && hours <= 24){
                if(checkInTime > 15){
                    if(checkOutTime <= 12 * 60){
                        const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay;
                        plan = "前延長" + preExtension + "本 + 宿泊1部";
                        return {price, plan};
                    }
                    else{
                        const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊1部 + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                else{
                    price = prices.rest + prices.stay;
                    plan = "休憩(サービスタイム3部) + 宿泊2部";
                    return {price, plan};
                } 
            }
            // サービス3部＋宿泊2部＋延長
            else if((checkOutTime <= 15.5 * 60 && checkOutTime > 14 * 60) && hours <= 24){
                if(checkInTime > 15){
                    if(checkOutTime < 15 * 60){
                        const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊1部 + 延長" + extension + "本";
                        return {price, plan};
                    }
                    // 前延長+サービス3部＋宿泊2部
                    else {
                        const extraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊1部 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                }
                else{
                    const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(サービスタイム3部) + 宿泊2部+ 延長" + extension + "本"; 
                    return {price, plan};
                }
            }
            else{
                const extraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                const extraHours = extraMinutes / 60;
                const preExtension = extraHours * 60 / 30;
                price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                plan = "前延長" + preExtension + "本 + 宿泊1部 + 休憩(サービスタイム2部)";
                return {price, plan};
            }
        }
        // 18：00〜21：30にチェックイン
        else if(checkInTime >= 18 && checkInTime < 22){
            if(hours <= 4){
                price = prices.rest;
                plan = "休憩(4時間)";
                return {price, plan};
            }
            // サービス＋延長(24時までにチェックアウトの場合)
            else if(hours <= 6){
                if((checkInTime > 20 && checkInTime < 22) && checkOutTime > 2 * 60){
                    price = prices.stay;
                    plan = "宿泊1部"; 
                    return {price, plan};
                }
                else{
                    const extraMinutes = Math.max(hours * 60 - 4 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            else if(checkOutTime === 0 && hours <= 6){
                const extraMinutes = Math.max(2 * 60 + checkOutTime); 
                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                price = prices.rest + calculateExtensionCharges(extraHours);
                const extension = extraHours * 60 / 30;
                plan = "休憩(4時間) + 延長" + extension + "本";
                return {price, plan};
            }
            // 宿泊1部
            else if(checkOutTime <= 12 * 60 && hours <= 18){
                price = prices.stay;
                plan = "宿泊1部"; 
                return {price, plan};
            }
            // 宿泊1部＋延長
            else if((checkOutTime < 15 * 60 && checkOutTime > 12 * 60) && hours < 21){
                if(checkInTime === 21.5 && checkOutTime === 12.5 * 60){
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay;
                    plan = "前延長" + preExtension + "本 + 宿泊2部";
                    return {price, plan};
                }
                else if(checkInTime >= 21 && (checkOutTime >= 13 * 60 && checkOutTime < 14 * 60)){
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay;
                        plan = "前延長" + preExtension + "本 + 宿泊2部";
                        return {price, plan};
                }
                else if(checkInTime > 20 && checkOutTime > 13 * 60){
                    if(checkOutTime <= 14 * 60){
                        const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay;
                        plan = "前延長" + preExtension + "本 + 宿泊2部";
                        return {price, plan};
                    }
                    else{
                        const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊2部 + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                else{
                    const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "宿泊1部 + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            // 宿泊1部＋サービス2部
            else if((checkOutTime <= 18 * 60 && checkOutTime >= 15 * 60) && hours <= 24){
                if(checkInTime > 20 && hours < 19){
                    const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 宿泊2部 + 延長" + extension + "本";
                    return {price, plan};
                }
                else{
                    price = prices.rest + prices.stay;
                    plan = "宿泊1部 + 休憩(サービスタイム2部)";
                    return {price, plan};
                } 
            }
            // 前延長+サービス3部＋宿泊2部
            else {
                if(checkInTime === 21 && hours === 24){
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay + prices.rest;
                    plan = "前延長" + preExtension + "本 + 宿泊2部 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime === 21.5 && hours >= 23){
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay + prices.rest;
                    plan = "前延長" + preExtension + "本 + 宿泊2部 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(checkInTime > 20 && checkOutTime > 20 * 60){
                    const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                    const extension = extraHours * 60 / 30;
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else{
                    price = prices.rest + prices.stay;
                    plan = "宿泊1部 + 休憩(サービスタイム2部)";
                    return {price, plan};
                } 
            }
        }
        //22:00~5:30
        else if(((checkInTime >= 22 && checkInTime < 24) || checkInTime < 6)){
            if(checkInTime === 23.5 && hours === 3){
                price = prices.midnight_rest;
                plan = "深夜休憩";
                return {price, plan};
            }
            else if (checkInTime < 6){
                if (hours <= 3) {
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                    return {price, plan};
                }
            }
            if(checkInTime >= 22){
                if(checkOutTime <= 2 * 60){
                    price = prices.rest;
                    plan = "休憩(4時間)";
                    return {price, plan};
                }
                else if (checkOutTime > 2 * 60 && checkOutTime < 17 * 60) {
                    if (checkOutTime <= 14 * 60) {
                        price = prices.stay;
                        plan = "宿泊2部";
                        return {price, plan};
                    }
                    else {
                        const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊2部 + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                else if (checkOutTime >= 17 * 60 || checkOutTime < 2 * 60) {
                    if(checkOutTime <= 23 * 60) {
                        price = prices.stay + prices.rest;
                        plan = "宿泊2部 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else {
                        const extraMinutes = Math.max(24 * 60 - checkOutTime) ; 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                        plan = "宿泊2部 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
            }
            if(checkInTime === 0){
                if(hours > 3 && hours <= 12){
                    price = prices.stay;
                    plan = "宿泊2部";
                    return {price, plan};
                }
                else if(hours < 15){
                    const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部 + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(hours <= 19){
                    price = prices.stay + prices.rest;
                    plan = "宿泊1部 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                else if(hours < 21){
                    const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(hours <= 22){
                    const preExtraMinutes = Math.max(2 * 60);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = calculateExtensionCharges(preExtraHours) + prices.stay + prices.rest;
                    plan = "宿泊2部 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if(hours < 23){
                    const preExtraMinutes = Math.max(2 * 60);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    const extraMinutes = Math.max(0.5 * 60) ; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(hours === 23){
                    price = prices.stay + prices.rest * 2;
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間)";
                    return {price, plan};
                }
                else if(hours === 23.5){
                    const extraMinutes = Math.max(0.5 * 60) ; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(hours === 24){
                    const extraMinutes = Math.max(1 * 60) ; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest * 2 + calculateExtensionCharges(extraHours);
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                    return {price, plan};
                }
            }
            if(checkInTime > 0 && checkInTime <= 2){
                if(hours <= 3){
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                    return {price, plan};
                }
                else if (checkOutTime <= 12 * 60 && (hours > 3 && hours < 12)){
                    price = prices.stay;
                    plan = "宿泊2部";
                    return {price, plan};
                }
                else if ((checkOutTime < 15 * 60 && checkOutTime > 12 * 60) && hours <= 14){
                    const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部 + 延長" + extension + "本";
                    return {price, plan};
                }
                else if ((checkOutTime <= 19 * 60 && checkOutTime >= 15 * 60) && hours < 19){
                    price = prices.stay + prices.rest;
                    plan = "宿泊1部 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                else if((checkOutTime < 21 * 60 && checkOutTime >= 19 * 60) && hours <= 20){
                    const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if((checkOutTime <= 22 * 60 && checkOutTime >= 21 * 60) && hours < 22){
                    const extraMinutes = Math.max(2 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.stay + calculateExtensionCharges(extraHours) + prices.rest;
                    const extension = extraHours * 60 / 30;
                    plan = "宿泊2部 + 前延長" + extension + "本 + 休憩(サービスタイム3部)";
                    return {price, plan};
                }
                else if((checkOutTime < 23 * 60 && checkOutTime > 22 * 60) && hours <= 22){
                    const extraMinutes = Math.max(0.5 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(2 * 60); 
                    const preExtraHours = preExtraMinutes / 60; // 延長時間を時間単位で計算
                    price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                    const preExtension = preExtraHours * 60 / 30;
                    plan = "宿泊2部 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                    return {price, plan};
                }
                else if(checkOutTime === 23 * 60 && hours < 23){
                    price = prices.stay + prices.rest * 2;
                    plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間)";
                    return {price, plan};
                }
                else{
                    if(checkOutTime === 23.5 * 60){
                        const extraMinutes = Math.max(0.5 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                        return {price, plan};
                    }
                    else if(checkOutTime < 1 * 60){
                        const extraMinutes = Math.max(1 * 60 + checkOutTime); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部 + 休憩(サービスタイム2部) + 休憩(4時間) + 延長" + extension + "本";
                        return {price, plan};
                    }
                    else{
                        const extraMinutes = Math.max(2 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        price = prices.stay + calculateExtensionCharges(extraHours) + prices.rest * 2;
                        const extension = extraHours * 60 / 30;
                        plan = "宿泊2部 + 前延長" + extension + "本 + 休憩(サービスタイム3部) + 休憩(4時間)";
                        return {price, plan};
                    }
                }
            }
            else if (checkInTime > 2 && checkInTime < 6) {
                if(hours <= 3){
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                    return {price, plan};
                }
                else if (hours <= 10){
                    price = prices.stay;
                    plan = "宿泊深夜保証10時間";
                    return {price, plan};
                }
                else if (hours < 13){
                    if(checkInTime === 5.5 && hours === 12.5){
                        const preExtraMinutes = Math.max(4.5 * 60);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                    else{
                        const extraMinutes = Math.max((hours - 10) * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊深夜保証10時間 + 延長" + extension + "本";
                        return {price, plan};
                    }
                }
                else if (hours < 16){
                    if(checkInTime > 2 && checkInTime < 4){
                        price = prices.stay + prices.rest;
                        plan = "宿泊1部 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                    else if(checkInTime >= 4 && checkInTime <= 5){
                        price = prices.stay + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else if(checkInTime === 5.5 && (hours < 16 && hours >= 14)){
                        price = prices.stay + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else{
                        const preExtraMinutes = Math.max(4.5 * 60);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                }
                else if(checkOutTime <= 19 * 60 && hours < 17){
                    price = prices.stay + prices.rest;
                    plan = "宿泊1部 + 休憩(サービスタイム2部)";
                    return {price, plan};
                }
                else if((checkOutTime < 20 * 60 && checkOutTime > 19 * 60) && hours <= 17){
                    if(checkInTime <= 3){
                        const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                        return {price, plan};
                    }
                    else{
                        const preExtraMinutes = Math.max(0.5 * 60);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                }
                else if(checkOutTime === 20 * 60 && hours < 18){
                    if(checkInTime === 2.5){
                        const extraMinutes = Math.max(checkOutTime - 19 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部 + 休憩(サービスタイム2部) + 延長" + extension + "本";
                        return {price, plan};
                    }
                    else if(checkInTime >= 3 && checkInTime < 4){
                        const preExtraMinutes = Math.max(4 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else{
                        price = prices.stay + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                }
                else if((checkOutTime <= 22 * 60 && checkOutTime > 20 * 60) && hours < 20){
                    if(checkInTime < 4){
                        const preExtraMinutes = Math.max(4 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else if(checkInTime <= 5 && checkInTime >= 4){
                        price = prices.stay + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部)";
                        return {price, plan};
                    }
                    else if(checkInTime === 5.5 && (hours < 17)){
                        price = prices.stay + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部)";
                        return {price, plan};  
                    }
                    else{
                        const preExtraMinutes = Math.max(4.5 * 60);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest;
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                        return {price, plan};
                    }
                }
                else if((checkOutTime < 1 * 60 || checkOutTime > 22 * 60) && hours <= 22){
                    if(checkOutTime > 22 * 60){
                        if(checkInTime < 4){
                            const extraMinutes = Math.max(checkOutTime - 22 * 60);
                            const extraHours = extraMinutes / 60;
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(4 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(checkOutTime - 22 * 60);
                            const extraHours = extraMinutes / 60;
                            const extension = extraHours * 60 / 30;
                            price = prices.stay + calculateExtensionCharges(extraHours) + prices.rest;
                            plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                    else{
                        if(checkInTime < 4){
                            const extraMinutes = Math.max(2 * 60 + checkOutTime);
                            const extraHours = extraMinutes / 60;
                            const extension = extraHours * 60 / 30;
                            const preExtraMinutes = Math.max(4 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest + calculateExtensionCharges(extraHours);
                            plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                        else{
                            const extraMinutes = Math.max(2 * 60 + checkOutTime);
                            const extraHours = extraMinutes / 60;
                            const extension = extraHours * 60 / 30;
                            price = prices.stay + calculateExtensionCharges(extraHours) + prices.rest;
                            plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部) + 延長" + extension + "本";
                            return {price, plan};
                        }
                    }
                }
                else if((checkOutTime <= 2 * 60 && checkOutTime >= 1 * 60) && hours < 24){
                    if(checkInTime < 4){
                        const preExtraMinutes = Math.max(4 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(preExtraHours) + prices.rest * 2;
                        plan = "宿泊深夜保証10時間 + 前延長" + preExtension + "本 + 休憩(サービスタイム3部) + 休憩(4時間)";
                        return {price, plan};
                    }
                    else{
                        price = prices.stay + prices.rest * 2;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部) + 休憩(4時間)";
                        return {price, plan};
                    }
                }
                else{
                    if(checkInTime < 4){
                        price = prices.stay * 2 + prices.rest;
                        plan = "宿泊1部 + 休憩(サービスタイム2部) + 宿泊1部";
                        return {price, plan};
                    }
                    else if(checkInTime <= 5){
                        price = prices.stay * 2 + prices.rest;
                        plan = "宿泊深夜保証10時間 + 休憩(サービスタイム3部) + 宿泊2部";
                        return {price, plan};
                    }
                    else{
                        const preExtraMinutes = Math.max(4.5 * 60);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = calculateExtensionCharges(preExtraHours) + prices.rest + prices.stay;
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部) + 宿泊1部";
                        return {price, plan};
                    }
                }
            }
        }
    }
    // 平日
    else if (!isWeekendOrHoliday(date)) {
        //宿泊1部(日曜〜金曜)18：00〜12：00
        if(checkInTime >= 18 && checkInTime < 22){
            // 20時までにチェックイン
            // 完成
            if (checkInTime <= 20) {
                if(hours <= 5){
                    price = prices.rest;
                    plan = "休憩(5時間)";
                }
                else if((checkOutTime > 23 * 60 || checkOutTime <= 2 * 60) && hours <= 7) {
                    if(hours <= 6){
                        const extraMinutes = Math.max(hours * 60 - 5 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(5時間) + 延長" + extension + "本";
                    }
                    else if (hours <= 7 && checkOutTime <= 2 * 60) {
                        const extraMinutes = Math.max(hours * 60 - 5 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(5時間) + 延長" + extension + "本";
                    }
                    else {
                        price = prices.stay;
                        plan = "宿泊1部(平日)";
                    }
                }
                else if (checkOutTime > 1 * 60 && checkOutTime <= 12 * 60) {
                    price = prices.stay;
                    plan = "宿泊1部(平日)";
                }
                else if (checkOutTime < 15 * 60) {
                    const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊1部(平日) + 延長" + extension + "本";
                }
                else {
                    price = prices.stay + prices.rest;
                    plan = "宿泊1部(平日) + 休憩(サービスタイム2部)";
                }
            }
            // 22時までにチェックイン
            if (checkInTime > 20 && checkInTime < 22) {
                if (((checkOutTime <= 24 * 60 && checkOutTime >= 23 * 60) || checkOutTime <= 2 * 60) && hours < 6){
                    if (checkInTime === 20.5 && hours === 5.5) {
                        const extraMinutes = Math.max(checkOutTime - 1.5 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(5時間) + 延長" + extension + "本";
                    }
                    else {
                        price = prices.rest;
                        plan = "休憩(5時間)";
                    }
                }
                else if (checkOutTime <= 12 * 60) {
                    price = prices.stay ;
                    plan = "宿泊1部(平日)";
                }
                else if (checkInTime === 20.5 && (hours >= 16 && hours < 17)) {
                        const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部(平日) + 延長" + extension + "本";
                }
                else if (checkInTime === 21 && (hours > 15 && hours <= 16)) {
                    if(hours < 16){
                        const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部(平日) + 延長" + extension + "本";
                    }
                    else {
                        const extraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊2部(平日)";
                    }
                }
                else if (checkInTime === 21.5 && (hours >= 15 && hours <= 16)) {
                    const extraMinutes = Math.max(30);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 宿泊2部(平日)";
                }
                else if (checkOutTime >= 13 * 60 && hours < 19) {
                    if (checkOutTime <= 14 * 60){
                        const extraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊2部(平日)";
                    }
                    else {
                        const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊2部(平日) + 延長 " + extension + "本";
                    }
                }
                else if (checkOutTime > 15 * 60 && checkOutTime <= 20 * 60 && hours >= 19) {
                    price = prices.stay + prices.rest;
                    plan = "宿泊1部(平日) + 休憩(サービスタイム2部)";
                }
                else if (checkOutTime === 20.5 * 60) {
                    if(checkInTime === 20.5 || checkInTime === 21){
                        const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                        plan = "宿泊1部(平日) + 休憩(サービスタイム2部) + 延長" + extension + "本";
                    }
                    else if (checkInTime === 21.5) {
                        const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊2部(平日) + 休憩(サービスタイム3部)";
                    }
                }
                else {
                    const preExtraMinutes = Math.max(22 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculatePreExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
            }
        }

        //宿泊2部(日曜〜金曜)22：00〜14：00
        else if((checkInTime >= 22 && checkInTime < 24) || checkInTime < 6){
            if((checkInTime >= 22 || checkInTime === 0) && checkOutTime <= 2 * 60){
                if (checkInTime >= 22) {
                    price = prices.rest;
                    plan = "休憩(5時間)";
                }
                else if (checkInTime < 2 && hours <= 3) {
                    price = prices._rest;
                    plan = "深夜休憩";
                }
                else {
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                }
            }
            else if (checkInTime < 6){
                if (hours <= 3) {
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                }
            }
            else if (checkOutTime > 2 * 60 && checkOutTime < 17 * 60) {
                if(checkInTime === 23.5 && hours === 3){
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                }
                else if (checkOutTime <= 14 * 60) {
                    price = prices.stay;
                    plan = "宿泊2部(平日)";
                }
                else {
                    const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 延長" + extension + "本";
                }
            }
            else if (checkOutTime >= 17 * 60 || checkOutTime < 2 * 60) {
                if(checkOutTime <= 23 * 60) {
                    price = prices.stay + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
                else {
                    const extraMinutes = Math.max(24 * 60 - checkOutTime) ; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
            }
            if(checkInTime === 1.5){
                if(hours <= 3){
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                }
                else if (hours < 13){
                    price = prices.stay;
                    plan = "宿泊2部(平日)";
                }
                else if (hours <= 15){
                    const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 延長" + extension + "本";
                }
                else if (hours < 22){
                    price = prices.stay + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
                else if(hours === 22){
                    const extraMinutes = Math.max(30); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                else if (hours <= 24){
                    const extraMinutes = Math.max(checkOutTime) + 60; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                // else {
                //     price = prices.stay + prices.rest * 2;
                //     plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 休憩(5時間)";
                // }
            }
            else if (checkInTime < 6) {
                if(hours <= 3){
                    price = prices.midnight_rest;
                    plan = "深夜休憩";
                }
                else if (hours <= 12){
                    if(checkInTime >= 0 && checkInTime <= 2 && checkOutTime <= 14 * 60){
                    price = prices.stay;
                    plan = "宿泊2部(平日)";
                    }
                    else {
                    price = prices.stay;
                    plan = "宿泊深夜保証12時間";
                    }
                }
                else if (hours < 15){
                    if (checkInTime >=0 && checkInTime <= 2 && checkOutTime <= 14 * 60){
                        price = prices.stay;
                        plan = "宿泊2部(平日)";
                    }
                    else if (checkInTime >= 0 && checkInTime <= 2 && checkOutTime > 14 * 60) {
                        const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊2部(平日) + 延長" + extension + "本";
                    }
                    else if(checkInTime === 5.5 && hours === 14.5){
                        const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)";
                    }
                    else {
                        const extraMinutes = Math.max((hours - 12) * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours);
                        plan = "宿泊深夜保証12時間 + 延長" + extension + "本";
                    
                    }
                }
                else if ((checkInTime >= 0 && checkInTime <= 2) && checkOutTime < 17 * 60) {
                    const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 延長" + extension + "本";
                }
                else if(checkInTime === 0 && (hours >= 17 && hours < 18)){
                    price = prices.stay + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
                else if (checkOutTime <= 23 * 60 && checkOutTime >= 17 * 60 && hours < 21){
                    price = prices.stay + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
                else if (checkOutTime > 23 * 60 && hours <= 23) {
                    const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                else if(checkInTime === 0 && hours === 23.5){
                    const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                else if (checkOutTime <= 1.5 * 60 && hours <= 24) {
                    const extraMinutes = Math.max(checkOutTime) + 60; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                else if (checkOutTime === 2 * 60 && hours === 20.5){
                    const extraMinutes = 30; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.midnight_stay + calculateExtensionCharges(extraHours);
                    plan = "深夜保証 + 延長"  + extension + "本 + 宿泊1部(平日)";
                }
                else if (checkOutTime === 2 * 60){
                    price = prices.stay + prices.rest * 2;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 休憩";
                }
                else if (hours === 21 && checkOutTime > 2 * 60 && checkOutTime <= 3 * 60){
                    const extraMinutes = 30; 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.midnight_stay + calculateExtensionCharges(extraHours);
                    plan = "深夜保証 + 延長"  + extension + "本 + 宿泊1部(平日)";
                }
                else if ((checkInTime <= 3) && (checkOutTime > 2 * 60 && checkOutTime <= 3 * 60)){
                    price = prices.stay* 2 + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 宿泊2部(平日)";
                }
                else if (checkInTime > 5 && hours <= 20) {
                    const extraMinutes = Math.max(18 * 60 - (checkInTime + 12 * 60)); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    price = prices.stay + prices.rest + calculateExtensionCharges(extraHours);
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 延長" + extension + "本";
                }
                else if (checkInTime > 3){
                    if(checkInTime === 3.5 && hours === 24){
                        price = prices.stay * 2 + prices.rest;
                        plan = "宿泊2部(平日) + 休憩(サービスタイム3部) + 宿泊2部(平日)";
                    }
                    else{
                        const extraMinutes = Math.max(6 * 60 - calculateCheckInTime); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.stay + prices.midnight_stay + calculateExtensionCharges(extraHours);
                        plan = "深夜保証 + 延長"  + extension + "本 + 宿泊1部(平日)";
                    }
                }
                else if (hours >= 18 && checkOutTime <= 23 * 60) {
                    price = prices.stay + prices.rest;
                    plan = "宿泊2部(平日) + 休憩(サービスタイム3部)";
                }
            }
        }
        // 休憩プラン・サービスタイム
        else if ((checkInTime >= 6 && checkInTime < 24) || (checkInTime >= 0 && checkInTime <= 2)) {
            // 月〜金曜 (6:00 - 18:00)
            if((checkInTime >= 6 && checkInTime < 10)){
                if(checkOutTime <= 18 * 60 && hours <= 12){
                    price = prices.rest;
                    plan = "休憩(サービスタイム1部)(平日)";
                }
                //前延長料金が発生する
                else if(checkInTime > 8 && (checkOutTime < 22 * 60 && checkOutTime > 19 * 60) && hours < 13){
                    if(hours < 12 && checkOutTime <= 20 * 60){
                    // チェックアウトが19:00〜20：00の場合
                    const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const extraHours = extraMinutes / 60;
                    const preExtension = extraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)";
                    }
                    else {
                    const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                    const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                    const extension = extraHours * 60 / 30;
                    const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                    const preExtraHours = preExtraMinutes / 60;
                    const preExtension = preExtraHours * 60 / 30;
                    price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                    plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 延長 " + extension + "本";
                    }
                }
                else if((checkOutTime < 21 * 60 && checkOutTime >= 18 * 60) && hours < 15){
                    if (checkInTime === 9) {
                        if(hours === 9.5){
                            const extraMinutes = Math.max(0.5 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            const extension = extraHours * 60 / 30;
                            plan = "休憩(サービスタイム1部)(平日) + 延長" + extension + "本";
                        }
                        if(hours === 10){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)";
                        }
                    }
                    else if (checkInTime === 9.5) {
                        if(hours >= 9 && hours < 11){
                            const extraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)";
                        }
                    }
                    // チェックアウトが18:00を超える場合の処理
                    else {
                        const extraMinutes = Math.max(checkOutTime - 18 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        const extension = extraHours * 60 / 30;
                        plan = "休憩(サービスタイム1部)(平日) + 延長" + extension + "本";
                    }
                }

                // サービス＋休憩
                else if((checkOutTime <= 23 * 60 && checkOutTime > 20.5 * 60) && hours <= 17){
                    // チェックアウトが23時までの場合の処理
                    if(checkInTime === 9.5 && hours >= 11 && hours <= 12.5) {
                        const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 延長 " + extension + "本";
                    }
                    else {
                        price = prices.rest * 2 ;
                        plan = "休憩(サービスタイム1部)(平日) + 休憩(5時間)";
                    }
                }
                // サービス＋休憩＋延長
                else if(((checkOutTime <= 24 * 60 && checkOutTime > 23 * 60) || checkOutTime <= 1 * 60) && hours <= 19){
                    // 24時までにチェックアウトの場合
                    // 8:30にチェックイン、16もしくは16.5時間滞在
                    if (checkOutTime > 0 && checkOutTime <= 1 * 60 && checkInTime === 8.5) {
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                    }
                    // 9：00にチェックイン、15〜17時間滞在
                    else if (checkOutTime >= 0 && checkOutTime <= 2 * 60 && checkInTime === 9) {
                        // if (checkOutTime > 1 * 60 && hours <= 17) {
                        //     const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        //     const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        //     const extension = extraHours * 60 / 30;
                        //     const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        //     const preExtraHours = preExtraMinutes / 60;
                        //     const preExtension = preExtraHours * 60 / 30;
                        //     price = prices.rest * 2 + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        //     plan = "前延長" + preExtension + "本 + 休憩(サービスタイ2部)(平日)+ 休憩(5時間) + 延長 " + extension + "本";
                        // }
                        // else {
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.rest * 2 + calculatePreExtensionCharges(preExtraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                        // }
                    }
                    // 9：30にチェックイン、14〜16.5時間滞在
                    else if ((checkOutTime > 23 * 60 || (checkOutTime >= 0 && checkOutTime <= 2 * 60)) && checkInTime === 9.5) {
                        if (checkOutTime > 23 * 60 && checkOutTime <= 24 * 60) {
                            const preExtraMinutes = Math.max(24 * 60 - checkOutTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.rest * 2 + calculatePreExtensionCharges(preExtraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)+ 休憩(5時間)";
                        }
                        // else if (checkOutTime > 1 * 60) {
                        //     const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        //     const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        //     const extension = extraHours * 60 / 30;
                        //     const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        //     const preExtraHours = preExtraMinutes / 60;
                        //     const preExtension = preExtraHours * 60 / 30;
                        //     price = prices.rest * 2 + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        //     plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)+ 休憩(5時間) + 延長 " + extension + "本";
                        // }
                        else {
                            const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.rest + prices.rest + calculatePreExtensionCharges(preExtraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                        }
                    }
                    else if (checkOutTime <= 24 * 60 && checkOutTime > 23  * 60) {
                        const extraMinutes = Math.max(24 * 60 - checkOutTime); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム1部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                    }
                    else {
                        const extraMinutes = checkOutTime + 60; 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム1部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                    }
                }
                // 24.5〜25.5時にチェックアウトの場合
                else if((checkOutTime > 0 &&checkOutTime <= 2 * 60)  && hours <= 17) {
                    if (checkOutTime > 1 * 60 && checkInTime === 9.5) {
                        const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)+ 休憩(5時間) + 延長 " + extension + "本";
                    }
                    else if(hours < 16.5){
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                    }
                    else {
                        const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(10 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム2部)(平日)+ 休憩(5時間) + 延長 " + extension + "本";
                    }
                }
                // サービス＋宿泊
                else if (!isSaturdayOrDaysOff(date)) {
                    if (hours <= 26){
                        price = prices.rest + prices.stay;
                        plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(平日)";
                    } 
                }
                else if (isSaturdayOrDaysOff(date)) {
                    if (hours <= 24){
                        price = prices.rest + prices.stay;
                        plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(土曜・祝前日・連休)";
                    }
                } 
            }

            // 月〜金曜 2部(10:00 - 20:00)
            else if(checkInTime >= 10 && checkInTime < 14){
                if(checkOutTime <= 20 * 60 && hours <= 10){
                    price = prices.rest;
                    plan = "休憩(サービスタイム2部)(平日)";
                }
                // チェックアウトが22：30を超える場合
                else if(checkInTime <= 11) {
                    if (checkOutTime < 23 * 60 && checkOutTime > 20 * 60 && hours < 13){
                        const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム2部)(平日) + 延長" + extension + "本";
                    }
                    else if ((checkOutTime <= 24 * 60 && checkOutTime >= 23 * 60) || checkOutTime <= 1 * 60) {
                        price = prices.rest * 2 ;
                        plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                    }
                    else if (checkOutTime > 1 * 60 && checkOutTime <= 2 * 60) {
                        const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                    }
                    else{
                        price = prices.rest + prices.stay;
                        plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(平日)";
                    }
                }
                //前延長料金が発生する
                //11：30にチェックイン
                else if(checkInTime > 11 && checkInTime < 12){
                    if(checkOutTime <= 22 * 60 && checkOutTime > 20 * 60){
                        const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム2部)(平日) + 延長" + extension + "本";
                    }
                    else if (checkOutTime > 22 * 60 && checkOutTime <= 23 * 60) {
                        // チェックアウトが~23:00の場合
                        const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                    }
                    else if (hours < 14){
                        price = prices.rest * 2 ;
                        plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                    }
                    else if(hours < 15){
                        const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                    }
                    else {
                        price = prices.rest + prices.stay;
                        plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(平日)";
                    }
                }
                // 12時以降にチェックイン
                else if (checkInTime >= 12 && checkInTime < 13) {
                    if(checkInTime === 12.5 && hours === 9){
                        const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                    }
                    else if (checkOutTime < 22 * 60 && checkOutTime > 20 * 60){
                        const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム2部)(平日) + 延長" + extension + "本";
                    }
                    else if (checkOutTime <= 23 * 60 && checkOutTime >= 22 * 60) {
                        const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                    }
                    else if (checkOutTime > 23 * 60 || checkOutTime <= 2 * 60){
                        if (hours < 12) {
                            if(checkOutTime === 0){
                                const extraMinutes = Math.max(checkOutTime) + 60; 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                            else {
                                const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                        }
                        else if (checkOutTime <= 1 * 60) {
                            price = prices.rest * 2 ;
                            plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                        }
                        else if (checkOutTime <= 2 * 60) {
                            const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                        }
                    }
                    else if (checkOutTime < 13 * 60) {
                        if (checkOutTime <= 12 * 60){
                            price = prices.rest + prices.stay;
                            plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(平日)";
                        }
                        else {
                            const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム1部)(平日) + 宿泊1部(平日)+ 延長" + extension + "本";
                        }
                    }
                }
                // 13時以降にチェックイン
                else if (checkInTime >= 13 && checkInTime < 14) {
                    if (checkOutTime < 22 * 60 && checkOutTime > 20 * 60){
                        if (checkInTime === 13 && hours >= 8&& hours < 9) {
                            const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                            const preExtraHours = preExtraMinutes / 60;
                            const preExtension = preExtraHours * 60 / 30;
                            price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                            plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                        }
                        else if (checkInTime === 13.5 && hours >= 7 && hours <= 12) {
                            if(hours < 10){
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                            }
                            else {
                                const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                        }
                        else {
                            const extraMinutes = Math.max(checkOutTime - 20 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム2部)(平日) + 延長" + extension + "本";
                        }
                    }
                    else if (checkOutTime <= 23 * 60 && checkOutTime >= 22 * 60) {
                        const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.rest + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日)";
                    }
                    else if (checkOutTime > 23 * 60 || checkOutTime <= 2 * 60){
                        if (hours <= 12) {
                            if(checkOutTime > 23  * 60 && hours < 12){
                                const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                            else if (checkOutTime <= 2 * 60 && hours < 12) {
                                const extraMinutes = Math.max(checkOutTime) + 60; 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                            else if (checkOutTime > 1 * 60 && checkOutTime < 2 * 60 && hours <= 12){
                                const extraMinutes = Math.max(checkOutTime) + 60; 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 延長 " + extension + "本";
                            }
                            else {
                                price = prices.rest * 2 ;
                                plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                            }
                        }
                        else if (checkOutTime <= 1 * 60) {
                            price = prices.rest * 2 ;
                            plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)";
                        }
                        else {
                            if(checkInTime === 13.5 && hours === 12.5){
                                const preExtraMinutes = Math.max(14 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.rest + prices.rest + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 休憩(サービスタイム3部)(平日) + 休憩(5時間)";
                            }
                            else {
                                const extraMinutes = Math.max(checkOutTime - 1 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest * 2 + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム2部)(平日) + 休憩(5時間)+ 延長" + extension + "本";
                            }
                        }
                    }
                    else if (checkOutTime < 14 * 60) {
                        if (checkOutTime <= 12 * 60){
                            price = prices.rest + prices.stay;
                            plan = "休憩(5時間)(平日) + 宿泊1部(平日)";
                        }
                        else {
                            const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                            plan = "休憩(5時間)(平日) + 宿泊1部(平日)+ 延長" + extension + "本";
                        }
                    }
                }
            }

            // 月〜金曜 3部(14:00 - 23:00)
            else if((checkInTime >= 14 && checkInTime < 18)){
                if((checkOutTime <= 23 * 60 && checkOutTime > 14 * 60) && hours <= 9){
                    price = prices.rest;
                    plan = "休憩(サービスタイム3部)(平日)";
                }
                // 15時までにチェックイン
                // 完成
                else if (checkInTime <= 15){
                    // 24時までに退室の場合
                    if(checkOutTime > 23 * 60 && hours < 12){
                        const extraMinutes = Math.max(0, checkOutTime - 23 * 60); // 延長時間(分単位)
                        const extraHours = Math.ceil(extraMinutes / 30) * 0.5; // 30分単位で計算
                        // 延長料金を計算して追加
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        const extension = extraHours * 60 / 30;
                        plan = "休憩(サービスタイム3部)(平日) + 延長" + extension + "本";
                    }
                    // 24時を過ぎて24時30分になるまでに退室の場合
                    else if(checkOutTime < 2 * 60  && hours < 12){
                        const extraMinutes = Math.max(checkOutTime + 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム3部)(平日)+ 延長" + extension + "本";
                    }
                    else if (checkOutTime < 2.5 * 60) {
                        price = prices.rest * 2;
                        plan = "休憩(サービスタイム3部)(平日)+ 休憩(5時間)";
                    }
                    else if (checkOutTime <= 14 * 60) {
                        price = prices.rest + prices.stay;
                        plan = "休憩(サービスタイム3部)(平日)+ 宿泊2部(平日)";
                    }
                    else {
                        const extraMinutes = Math.max(checkOutTime - 14 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                        plan = "休憩(サービスタイム3部)(平日) + 宿泊2部(平日)+ 延長" + extension + "本";
                    }
                }
                // 18時までにチェックイン
                else if(checkInTime < 18 && checkInTime > 15) {
                // サービス＋休憩(2時までにチェックアウトの場合)
                    if((checkOutTime >= 23 * 60|| checkOutTime <= 2 * 60) && hours < 11){
                        if(checkOutTime >= 23 * 60) {
                            const extraMinutes = Math.max(checkOutTime - 23 * 60); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム3部)(平日) + 延長" + extension + "本";
                        }
                        else if (checkOutTime <= 2 * 60 && hours < 10){
                            if(checkInTime === 16.5 && hours === 9.5){
                                price = prices.rest * 2 ;
                                plan = "休憩(サービスタイム3部)(平日) + 休憩(5時間)";
                            }
                            else if (checkInTime === 17 && hours === 9) {
                                price = prices.rest * 2 ;
                                plan = "休憩(サービスタイム3部)(平日) + 休憩(5時間)";
                            }
                            else if (checkInTime === 17.5 && hours === 8.5) {
                                const extraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                                const extraHours = extraMinutes / 60;
                                const preExtension = extraHours * 60 / 30;
                                price = prices.stay + calculateExtensionCharges(extraHours);
                                plan = "前延長" + preExtension + "本 + 宿泊1部(平日)";
                            }
                            else {
                                const extraMinutes = Math.max(1 * 60 + checkOutTime); 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                price = prices.rest + calculateExtensionCharges(extraHours);
                                plan = "休憩(サービスタイム3部)(平日) + 延長" + extension + "本";
                            }
                        }
                        else if(checkInTime === 15.5 && hours === 10){
                            const extraMinutes = Math.max(1 * 60 + checkOutTime); 
                            const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                            const extension = extraHours * 60 / 30;
                            price = prices.rest + calculateExtensionCharges(extraHours);
                            plan = "休憩(サービスタイム3部)(平日) + 延長" + extension + "本";
                        }
                        else {
                            price = prices.rest * 2 ;
                            plan = "休憩(サービスタイム3部)(平日) + 休憩(5時間)";
                        } 
                    }
                    else if(checkOutTime > 2 * 60 && checkOutTime <= 16 * 60 && hours < 21){
                        if (checkOutTime > 12 * 60 && checkOutTime <= 14 * 60) {
                            if(checkInTime >= 16 && checkInTime < 18){
                                const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                                const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                                const extension = extraHours * 60 / 30;
                                const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                                const preExtraHours = preExtraMinutes / 60;
                                const preExtension = preExtraHours * 60 / 30;
                                price = prices.stay + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                                plan = "前延長" + preExtension + "本 + 宿泊1部(平日) + 延長 " + extension + "本";
                            }
                        }
                        else {
                            const extraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                            const extraHours = extraMinutes / 60;
                            const preExtension = extraHours * 60 / 30;
                            price = prices.stay + calculateExtensionCharges(extraHours);
                            plan = "前延長" + preExtension + "本 + 宿泊1部(平日)";
                        }
                    }
                    else if (checkOutTime < 15 * 60) {
                        const extraMinutes = Math.max(checkOutTime - 12 * 60); 
                        const extraHours = extraMinutes / 60; // 延長時間を時間単位で計算
                        const extension = extraHours * 60 / 30;
                        const preExtraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const preExtraHours = preExtraMinutes / 60;
                        const preExtension = preExtraHours * 60 / 30;
                        price = prices.stay + calculateExtensionCharges(extraHours) + calculatePreExtensionCharges(preExtraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊1部(平日) + 延長 " + extension + "本";
                    }
                    else {
                        const extraMinutes = Math.max(18 * 60 - calculateCheckInTime);
                        const extraHours = extraMinutes / 60;
                        const preExtension = extraHours * 60 / 30;
                        price = prices.rest + prices.stay + calculateExtensionCharges(extraHours);
                        plan = "前延長" + preExtension + "本 + 宿泊1部(平日) + 休憩(サービスタイム2部)";
                    }
                }
            }
        }
    }
    return {price, plan};
}

window.calculatePrice_A = calculatePrice_A;
