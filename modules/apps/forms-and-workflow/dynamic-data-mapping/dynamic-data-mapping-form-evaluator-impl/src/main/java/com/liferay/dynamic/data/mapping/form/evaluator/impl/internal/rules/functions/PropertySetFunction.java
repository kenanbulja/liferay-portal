/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.dynamic.data.mapping.form.evaluator.impl.internal.rules.functions;

import com.liferay.dynamic.data.mapping.form.evaluator.DDMFormFieldEvaluationResult;
import com.liferay.portal.kernel.util.StringUtil;

import java.util.List;
import java.util.Map;

/**
 * @author Leonardo Barros
 */
public class PropertySetFunction extends BasePropertyFunction {

	public PropertySetFunction(
		Map<String, List<DDMFormFieldEvaluationResult>>
			ddmFormFieldEvaluationResults) {

		super(ddmFormFieldEvaluationResults);
	}

	@Override
	public Object evaluate(Object... parameters) {
		String[] fieldNameParts = StringUtil.split(
			parameters[0].toString(), '#');

		String property = parameters[1].toString();

		DDMFormFieldEvaluationResult ddmFormFieldEvaluationResult =
			getDDMFormFieldEvaluationResult(
				fieldNameParts[0], Integer.valueOf(fieldNameParts[1]));

		if (property.equals("readOnly")) {
			ddmFormFieldEvaluationResult.setReadOnly(
				Boolean.valueOf(parameters[2].toString()));
		}
		else if (property.equals("valid")) {
			ddmFormFieldEvaluationResult.setValid(
				Boolean.valueOf(parameters[2].toString()));

			if (parameters.length > 3) {
				ddmFormFieldEvaluationResult.setErrorMessage(
					parameters[3].toString());
			}
		}
		else if (property.equals("value")) {
			ddmFormFieldEvaluationResult.setValue(parameters[2]);
		}
		else if (property.equals("visible")) {
			ddmFormFieldEvaluationResult.setVisible(
				Boolean.valueOf(parameters[2].toString()));
		}

		return true;
	}

}