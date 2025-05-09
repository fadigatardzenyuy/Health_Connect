import { supabase } from "@/lib/supabase";

export async function loginUser(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
}

export async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function signUpHospitalAdmin(email, password, fullName, hospitalName, avatarFile = null) {
    console.log("Signing up hospital admin:", email, fullName, hospitalName);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'hospital_admin',
                    hospital_name: hospitalName,
                },
            },
        });

        if (error) throw error;
        if (!data.user) throw new Error("User creation failed");

        let avatarUrl = null;
        if (avatarFile) {
            avatarUrl = await uploadAvatar(data.user.id, avatarFile);

            if (avatarUrl) {
                const { error: avatarError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: avatarUrl })
                    .eq('id', data.user.id);

                if (avatarError) {
                    console.error('Error updating profile with avatar:', avatarError);
                }
            }
        }

        return data.user;
    } catch (error) {
        console.error("Hospital admin signup error:", error);
        throw error;
    }
}

async function uploadAvatar(userId, avatarFile) {
    try {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, avatarFile);

        if (error) {
            console.error('Error uploading avatar:', error);
            return null;
        }

        const { data } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Avatar upload error:', error);
        return null;
    }
}

export async function verifyDoctorCode(code, userId) {
    console.log(`Verifying doctor code ${code} for user ${userId}`);

    const { data: verificationData, error: verificationError } = await supabase
        .from('doctor_verifications')
        .select('*')
        .eq('doctor_id', userId)
        .eq('license_number', code)
        .single();

    if (verificationError || !verificationData) {
        console.error('Verification error:', verificationError);
        throw new Error("Invalid license number");
    }

    const { error: updateError } = await supabase
        .from('doctor_verifications')
        .update({
            status: 'verified',
            verification_date: new Date().toISOString(),
        })
        .eq('doctor_id', userId)
        .eq('license_number', code);

    if (updateError) {
        console.error('Update verification error:', updateError);
        throw updateError;
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId);

    if (profileError) {
        console.error('Update profile error:', profileError);
        throw profileError;
    }

    console.log('Doctor verification successful');
}

export async function checkVerificationCode(verificationCode, userId) {
    console.log(`Checking verification code ${verificationCode} for user ${userId}`);

    if (!verificationCode || !userId) {
        console.error('Missing verification code or user ID');
        throw new Error("Missing verification code or user ID");
    }

    const { data, error } = await supabase
        .from('doctor_verifications')
        .select('id')
        .eq('doctor_id', userId)
        .eq('verification_code', verificationCode)
        .single();

    if (error || !data) {
        console.error('Verification code check error:', error);
        throw new Error("Invalid verification code");
    }

    console.log('Found verification record:', data);

    const { error: updateError } = await supabase
        .from('doctor_verifications')
        .update({
            status: 'verified',
            verification_date: new Date().toISOString()
        })
        .eq('id', data.id);

    if (updateError) {
        console.error('Update verification error:', updateError);
        throw updateError;
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId);

    if (profileError) {
        console.error('Update profile error:', profileError);
        throw profileError;
    }

    console.log('Doctor verification successful with verification code');
    return true;
}

export async function resetDoctorVerificationCode(userId) {
    console.log(`Resetting verification code for user ${userId}`);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase
        .from('doctor_verifications')
        .update({
            verification_code: verificationCode,
            status: 'pending'
        })
        .eq('doctor_id', userId);

    if (error) {
        console.error('Reset verification code error:', error);
        throw error;
    }

    console.log(`New verification code generated: ${verificationCode}`);
    return verificationCode;
}

export async function updateUserProfile(userId, updates) {
    const profileUpdates = {};

    if (updates.name !== undefined) {
        profileUpdates.full_name = updates.name;
    }

    if (updates.email !== undefined) {
        profileUpdates.email = updates.email;
    }

    if (updates.avatarUrl !== undefined) {
        profileUpdates.avatar_url = updates.avatarUrl;
    }

    if (updates.specialization !== undefined) {
        profileUpdates.specialization = updates.specialization;
    }

    if (updates.hospitalName !== undefined) {
        profileUpdates.hospital_name = updates.hospitalName;
    }

    const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

    if (error) throw error;
}

export async function checkDoctorVerificationStatus(userId) {
    console.log(`Checking verification status for user ${userId}`);

    const { data, error } = await supabase
        .from('profiles')
        .select('is_verified, role')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.error('Verification status check error:', error);
        return false;
    }

    return data.role === 'doctor' && data.is_verified === true;
}

export async function getDoctorVerificationDetails(userId) {
    console.log(`Getting verification details for user ${userId}`);

    const { data, error } = await supabase
        .from('doctor_verifications')
        .select('*')
        .eq('doctor_id', userId)
        .single();

    if (error) {
        console.error('Get verification details error:', error);
        return null;
    }

    return data;
}

export async function checkHospitalAdminStatus(userId) {
    console.log(`Checking hospital admin status for user ${userId}`);

    const { data, error } = await supabase
        .from('profiles')
        .select('is_verified, role, hospital_id')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.error('Hospital admin status check error:', error);
        return { isVerified: false, hospitalId: null };
    }

    return {
        isVerified: data.role === 'hospital_admin' && data.is_verified === true,
        hospitalId: data.hospital_id
    };
}